import {SpanStatusCode, trace} from "@opentelemetry/api";
import {Request, Response} from 'express';
import {StatusCodes,} from 'http-status-codes';
import {IConfig, RawRequest, RestifiedEndpoint} from "./types";

const queryString = require('qs');

function parseQuery(query: string): Record<string, unknown> {
    const parameters = queryString.parse(query);
    let result: Record<string, unknown> = {}

    for (let key in parameters) {
        if (Array.isArray(parameters[key])) {
            result[key] = (<string[]>parameters[key]).map(value => isNaN(parseFloat(value)) ? value : parseFloat(value));
        } else {
            result[key] = parameters[key] && isNaN(parseFloat(<string>parameters[key])) ? parameters[key] : parseFloat(<string>parameters[key]);
        }
    }

    return result;
}

const tracer = trace.getTracer("restified-endpoints-plugin");

export const restifiedHandler = (Config: IConfig, request: Request, response: Response, graphqlServerUrl: string) => {
    return tracer.startActiveSpan("Handle request", async (span) => {
        // Authentication
        if (
            request.headers?.["hasura-m-auth"] !== Config.headers?.["hasura-m-auth"]
        ) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: String("Unauthorized request!"),
            });
            span.end();
            response.status(StatusCodes.UNAUTHORIZED).json({message: "unauthorized request"})
        } else {

            const {path, method} = request.body as RawRequest

            // Find matching RESTified endpoint
            const endpoint: RestifiedEndpoint | undefined = Config.restifiedEndpoints(request.headers).find(
                (e) => matchPath(e.path, path) && e.methods.includes(method),
            );

            if (!endpoint) {
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: String("Endpoint not found"),
                });
                span.end();
                response.status(StatusCodes.NOT_FOUND).json({message: "Endpoint not found"})
            } else {

                // Extract variables
                const variables = extractVariables(request.body, endpoint);
                const query = endpoint?.query;

                // Execute GraphQL query
                try {
                    endpoint.transformers?.in?.({query, variables, request, graphqlServerUrl})
                    const result = await executeGraphQL(
                        Config,
                        query || '',
                        variables,
                        request,
                        graphqlServerUrl,
                    );
                    const newResult = endpoint.transformers?.out?.(request.query, result, request, Config.domainTransformer.recordTransformers) || result;
                    span.setStatus({
                        code: SpanStatusCode.OK,
                        message: String("Query executed successfully"),
                    });
                    span.end();
                    response.status(StatusCodes.OK).json(newResult)
                } catch (error) {
                    const err = error as Error;
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: String(`GraphQL execution error: ${err.message}`),
                    });
                    span.end();
                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Internal server error"})
                }
            }
        }
    });
};

function extractVariables(request: RawRequest, endpoint: RestifiedEndpoint) {
    // This should handle route patterns, query parameters, and request body
    // We can have two types of variables in the request (which is GET for now):
    // 1. Path parameters (e.g., /v1/users/:id)
    // 2. Query parameters (e.g., /v1/users?id=1)
    // We can have both as well

    // our request looks something like:
    // {"path":"/v1/users/1","method":"GET","query":"foo=bar&hello=world"}
    const endpointPath = endpoint.path; // /v1/users/:id
    const variables = {
        ...endpoint.variables,
        ...parseQuery(request.query),
        ...request.body as Record<string, unknown>
    };
    // Split the endpoint path and request path into segments
    const endpointSegments = endpointPath.split("/");
    const pathSegments = request.path.split('/');
    // Iterate over the segments and extract variables
    for (let i = 0; i < endpointSegments.length; i++) {
        const endpointSegment = endpointSegments[i];
        const pathSegment: string = pathSegments[i]
        if (endpointSegment.startsWith(":")) {
            const variableName = endpointSegment.slice(1);
            variables[variableName] = (() => {
                try {
                    return JSON.parse(pathSegment);
                } catch (e) {
                    return pathSegment
                }
            })();
        }
    }
    return variables;
}

async function executeGraphQL(
    Config: IConfig,
    query: String,
    variables: Record<string, unknown>,
    request: Request,
    graphqlServerUrl: string,
) {
    const response = await fetch(graphqlServerUrl, {
                method: "POST",
                headers: {
                    ...Config.graphqlServer.headers?.forward?.reduce((acc: Record<string, string> | {
                        [header: string]: string
                    }, header: string) => {
                        const value = request.headers[header];
                        if (value) {
                            if (Array.isArray(value)) {
                                acc[header] = value.join(",")
                            } else {
                                acc[header] = value as string;
                            }
                        }
                        return acc;
                    }, {}),
                    ...(Config.graphqlServer.headers?.additional as Record<string, string | string[]>),
                } as Headers,

                // },
                body:
                    JSON.stringify({query, variables}),
            }
        )
    ;
    if (!response.ok) {
        return undefined;
    }
    return response.json();
}

function matchPath(endpointPathTemplate: string, path: string): boolean {
    // This function should return true if the path matches the endpoint path template
    // This should handle route patterns (e.g., /v1/users/:id)
    let toReturn = true;
    const endpointSegments = endpointPathTemplate.split("/");
    const pathSegments = path.split("/");
    for (let i = 0; i < endpointSegments.length; i++) {
        const endpointSegment = endpointSegments[i];
        const pathSegment = pathSegments[i];
        if (endpointSegment !== pathSegment && !endpointSegment.startsWith(":")) {
            toReturn = false;
        }
    }
    return toReturn;
}
