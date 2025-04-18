// Schema for Record Responses
import {ErrorResponse} from "./error-response";
import {ExecutionResult} from "graphql/execution";
import {Request} from "express";
import {RecordTransformers} from "./transformers";
import {DynamicResponse} from "./paginated-response";


// Combine the two using an intersection type
// A RecordResponse must conform to both StaticResponseProperties and DynamicResponse<T>
export type RecordResponse<T> = DynamicResponse<T>;
/**
 * Type definitions for the paginated response
 */

export type RecordResponseReturn<R> = R | RecordResponse<R> | ErrorResponse;

/**
 * Options for the createRecordResponse function
 */
export interface RecordResponseOptions {
    resourceName: string;           // Name of the resource in GraphQL response
    transformerKey?: string;        // Key for transformer lookup (defaults to resourceName)
    itemKey?: string;               // Key for items in response (defaults to 'items')
}

export type RecordResponseFunction = <T, R>(
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers: RecordTransformers,
    options: RecordResponseOptions
) => RecordResponseReturn<R>
