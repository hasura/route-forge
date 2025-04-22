import {
    GenericResponseFactory,
    PaginatedResponseFunction,
    PaginatedResponseOptions,
    PaginatedResponseReturn,
    RecordTransformers,
    TransformerFunction
} from "../types";
import {ExecutionResult} from "graphql/execution";
import {Request} from "express";
import {recordTransformer} from "../record-transformer";
import assert from "assert";


/**
 * A generic transformer function that converts GraphQL responses into standardized paginated responses
 *
 * @param params Request parameters containing pagination info
 * @param graphqlResponse The raw GraphQL execution result
 * @param req The original request object
 * @param recordTransformers Object containing transformation functions for different result types
 * @param options Configuration options for the paginated response
 * @returns A standardized paginated response or error response
 */
export const paginatedResponseFunc: PaginatedResponseFunction = <T extends Record<string, unknown>, R>(
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers: RecordTransformers,
    options: PaginatedResponseOptions
): PaginatedResponseReturn<R> => {
    // Apply defaults to options
    const {
        resourceName,
        transformerKey = resourceName,
        defaultLimit,
        itemsKey = 'items'
    } = options;

    const LOCAL_SERVER = process.env.GRAPHQL_SERVER_URL ?? 'http://localhost:3280';
    const SERVER_URI = LOCAL_SERVER.replace(/\/graphql/, '')

    // Handle GraphQL errors
    if (graphqlResponse.errors) {
        return {
            code: graphqlResponse.errors[0].name,
            message: graphqlResponse.errors[0].message,
            debugMessage: ""
        } as PaginatedResponseReturn<R>;
    }

    // Handle empty response
    if (!graphqlResponse.data) {
        return {
            [itemsKey]: [] as R[],
            page: {
                total: 0,
            },
        } as PaginatedResponseReturn<R>;
    }

    // Extract data items from the response using the resource name
    const items: T[] = (graphqlResponse.data[resourceName] as T[]) ?? [];

    // Parse pagination parameters
    const offset = parseInt(params.offset, 10) || 0;
    const limit = parseInt(params.limit, 10) || defaultLimit || items.length;

    // Get the field transformers from recordTransformers
    const fieldTransformers = recordTransformers[transformerKey];
    assert(fieldTransformers)

    // Apply the appropriate transformer to each item
    const transformer = (item: T): R =>
        recordTransformer<R>(fieldTransformers, item, req);

    // Apply pagination and transform the items
    const paginatedItems: R[] = items.slice(offset, offset + limit).map(transformer);

    // Construct the response with pagination metadata
    const hasNextPage = offset + limit < items.length;

    return {
        [itemsKey]: paginatedItems,
        page: {
            total: items.length,
            nextOffset: hasNextPage ? (offset + limit).toString() : undefined,
        },
        links: hasNextPage ? {
            next: {
                href: `${SERVER_URI}${req.body.path}?offset=${offset + limit}&limit=${limit}`
            }
        } : undefined
    } as PaginatedResponseReturn<R>;
};

export function paginatedResponse(options: PaginatedResponseOptions): TransformerFunction {
    return function (params: Record<string, any>,
                     graphqlResponse: ExecutionResult,
                     req: Request,
                     recordTransformers: RecordTransformers) {
        return paginatedResponseFunc(params, graphqlResponse, req, recordTransformers, options);
    }
}

export const paginatedResponseFactory: GenericResponseFactory = paginatedResponse;


