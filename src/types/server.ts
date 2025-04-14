import {Request} from "express";
import {ExecutionResult} from "graphql/execution";
import {DomainTransformer, RecordTransformers} from "./transformers";


export type TransformerFunction = (
    params: Record<string, any>,
    response: any,
    req: Request,
    recordTransformers: RecordTransformers
) => Promise<any> | any;

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

export type TransformGraphQLResponseOut = (params: Record<string, any>, response: ExecutionResult) => Record<string, unknown>;
export type TransformGraphQLResponseIn = (endpoint: {
    query?: string,
    variables: Record<string, unknown>,
    request: Request,
    graphqlServerUrl: string
}) => any;

export interface RawRequest {
    path: string
    query: string
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
    body: unknown
}

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