// generic-response.ts
import {ExecutionResult} from "graphql/execution";
import {Request} from "express";
import {ErrorResponse} from "./error-response";
import {RecordTransformers} from "./transformers";

// Base type - can be any
export type GenericResponse<R> = any;

/**
 * Return type for generic response functions
 */
export type GenericResponseReturn<R> = GenericResponse<R> | ErrorResponse;

/**
 * Function type for creating generic responses
 */
export type GenericResponseFunction = <T, R>(
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers: RecordTransformers,
) => GenericResponseReturn<R>;

export type GenericResponseFactory = (...args: any[]) => GenericResponseFunction