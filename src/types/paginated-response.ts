// Schema for Paginated Responses
import {ErrorResponse} from "./error-response";
import {ExecutionResult} from "graphql/execution";
import {Request} from "express";
import {RecordTransformers} from "./transformers";

// Define interface for the dynamic part
export interface DynamicResponse<T> {
    [key: string]: T[];
}

// Combine the two using an intersection type
// A PaginatedResponse must conform to both StaticResponseProperties and DynamicResponse<T>
export type PaginatedResponse<T> = StaticResponseProperties & DynamicResponse<T>;

/**
 * Type definitions for the paginated response
 */
interface StaticResponseProperties {
    page: {
        total: number;
        nextOffset?: string;
    };
    links?: {
        next?: {
            href: string;
        };
    };
}

export type PaginatedResponseReturn<R> = PaginatedResponse<R> | ErrorResponse;

/**
 * Options for the createPaginatedResponse function
 */
export interface PaginatedResponseOptions {
    resourceName: string;           // Name of the resource in GraphQL response
    transformerKey?: string;        // Key for transformer lookup (defaults to resourceName)
    baseUrl: string;                // Base URL for pagination links
    defaultLimit?: number;          // Default limit if not specified (defaults to all)
    itemsKey?: string;              // Key for items in response (defaults to 'items')
}

export type PaginatedResponseFunction = <T, R>(
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers: RecordTransformers,
    options: PaginatedResponseOptions
) => PaginatedResponseReturn<R>
