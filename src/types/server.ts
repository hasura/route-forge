import {Request} from "express";
import {DomainTransformer, RecordTransformers} from "./transformers";


/**
 * Represents a function used for transforming incoming data into outgoing API responses.
 * @typedef {TransformerFunction}
 * @param {Record<string, any>} params - Parameters used for transformation.
 * @param {any} response - The response to be transformed.
 * @param {Request} req - The request object containing request details.
 * @param {RecordTransformers} recordTransformers - Object containing various transformers.
 * @returns {Promise<any> | any} The transformed response or a promise that resolves to the transformed response.
 */
export type TransformerFunction = (
    params: Record<string, any>,
    response: any,
    req: Request,
    recordTransformers: RecordTransformers
) => Promise<any> | any;

/**
 * Represents an endpoint that is restified, containing path, supported methods, query parameters, optional variables, output record transformers, and input/output transformers.
 *
 * @interface
 *
 * @property {string} path - The path of the endpoint.
 * @property {string[]} methods - The supported HTTP methods for the endpoint.
 * @property {string} query - The query parameters for the endpoint.
 * @property {Record<string, any>} [variables] - Optional variables for the endpoint.
 * @property {string[]} [outRecordTransformers] - Output record transformers for the endpoint. Documents the transform functions used to modify the input records.
 * @property {Object} transformers - Input/output transformers for the endpoint.
 * @property {TransformGraphQLResponseIn | undefined} [transformers.in] - Input transformer function for GraphQL response.
 * @property {TransformerFunction | undefined} [transformers.out] - Output transformer function.
 */
export interface RestifiedEndpoint {
    path: string;
    methods: string[];
    query: string;
    variables?: Record<string, any>;
    outRecordTransformers?: string[];
    transformers: {
        in?: TransformGraphQLResponseIn;
        out?: TransformerFunction;
    };
}

/**
 * Represents a function that transforms a GraphQL response before processing it.
 *
 * @param {Object} endpoint - The endpoint object containing query, variables, request, and GraphQL server URL.
 * @param {string} endpoint.query - The GraphQL query string.
 * @param {Object} endpoint.variables - The variables to be used in the GraphQL query.
 * @param {Request} endpoint.request - The request object containing information about the request.
 * @param {string} endpoint.graphqlServerUrl - The URL of the GraphQL server.
 * @returns {any} The transformed GraphQL response for further processing.
 */
export type TransformGraphQLResponseIn = (endpoint: {
    query?: string,
    variables: Record<string, unknown>,
    request: Request,
    graphqlServerUrl: string
}) => any;

/**
 * Represents a raw HTTP request object. This is the object Hasura puts into
 * the header when calling the route plugin.
 * @interface
 */
export interface RawRequest {
    path: string
    query: string
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
    body: unknown
}

/**
 * Interface representing the configuration options for the application.
 *
 * @interface
 * @property {string} serverName - The name of the server.
 * @property {DomainTransformer} domainTransformer - The transformer for domain.
 * @property {Object} graphqlServer - Configuration options for GraphQL server.
 * @property {Object} graphqlServer.headers - Additional headers for the GraphQL server.
 * @property {Object} graphqlServer.headers.additional - Additional headers for the GraphQL server.
 * @property {string[]} graphqlServer.headers.forward - List of headers to forward.
 * @property {Object} headers - Additional headers for the server.
 * @property {(headers: any) => RestifiedEndpoint[]} restifiedEndpoints - Function to return restified endpoints based on headers.
 */
export interface IConfig {
    serverName: string,
    domainTransformer: DomainTransformer
    graphqlServer: {
        headers?: {
            additional?: Record<string, string>;
            forward?: string[];
        }
    };
    headers?: Record<string, string>;
    restifiedEndpoints: (headers: any) => RestifiedEndpoint[]
}