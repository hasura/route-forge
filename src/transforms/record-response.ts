import {
    GenericResponseFactory,
    RecordResponseFunction,
    RecordResponseOptions,
    RecordResponseReturn,
    RecordTransformers,
    TransformerFunction
} from "../types";
import {ExecutionResult} from "graphql/execution";
import {Request} from "express";
import {recordTransformer} from "../record-transformer";
import assert from "assert";

/**
 * A generic transformer function that converts GraphQL responses into standardized record responses
 *
 * @param params Request parameters containing pagination info
 * @param graphqlResponse The raw GraphQL execution result
 * @param req The original request object
 * @param recordTransformers Object containing transformation functions for different result types
 * @param options Configuration options for the record response
 * @returns A standardized record response or error response
 */
export const recordResponseFunc: RecordResponseFunction = <T extends Record<string, unknown>, R>(
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers: RecordTransformers,
    options: RecordResponseOptions
): RecordResponseReturn<R> => {
    // Apply defaults to options
    const {
        resourceName,
        transformerKey = resourceName,
        itemKey = 'items'
    } = options;

    // Handle GraphQL errors
    if (graphqlResponse.errors) {
        return {
            code: graphqlResponse.errors[0].name,
            message: graphqlResponse.errors[0].message,
            debugMessage: ""
        } as RecordResponseReturn<R>;
    }

    // Handle empty response
    if (!graphqlResponse.data) {
        if (itemKey) {
            return {
                [itemKey]: null
            } as RecordResponseReturn<R>;
        } else {
            return null as RecordResponseReturn<R>
        }
    }

    // Extract data items from the response using the resource name
    const item: T = (graphqlResponse.data[resourceName] as T) ?? null;

    // Get the field transformers from recordTransformers
    const fieldTransformers = recordTransformers[transformerKey];
    assert(fieldTransformers)

    const transformedItem = item ? recordTransformer<R>(fieldTransformers, item, req) : undefined;

    if (itemKey) {
        return {
            [itemKey]: transformedItem,
        } as RecordResponseReturn<R>;
    } else {
        return transformedItem as RecordResponseReturn<R>;
    }
};

export function recordResponseFactory(options: RecordResponseOptions): TransformerFunction {
    return function (params: Record<string, any>,
                     graphqlResponse: ExecutionResult,
                     req: Request,
                     recordTransformers: RecordTransformers) {
        return recordResponseFunc(params, graphqlResponse, req, recordTransformers, options);
    }
}

export const recordResponse: GenericResponseFactory = recordResponseFactory;


