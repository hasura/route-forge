import {GenericResponseFactory, TransformerFunction} from "../types";
import {paginatedResponse} from "./paginated-response";
import {recordResponse} from "./record-response";

export const responseFactories: Record<string, GenericResponseFactory> = {}

export const registerResponseFactories = (factories: GenericResponseFactory[]) => {
    for (let factory of factories) {
        responseFactories[factory.name] = factory
    }
    return responseFactories;
}

function isTransformerFunction(obj: any): obj is TransformerFunction {
    return typeof obj === 'function'
}

function isBareTransformerName(obj: any): obj is string {
    const typeMatched = typeof obj === 'string';
    return typeMatched && responseFactories[obj] !== undefined;
}

function isTransformerName(obj: any): obj is string[] {
    const typeMatched = Array.isArray(obj) && obj.length === 2 &&
        typeof obj[0] === 'string' && Array.isArray(obj[1]);
    return typeMatched && responseFactories[obj[0]] !== undefined;
}

export const getTransformerFunction = (item?: TransformerFunction | string | [string, [unknown]]): TransformerFunction | undefined => {
    let transformerFunctionFinalized: TransformerFunction | undefined;
    if (isTransformerFunction(item)) {
        transformerFunctionFinalized = item;
    } else if (isBareTransformerName(item)) {
        transformerFunctionFinalized = responseFactories[item]();
    } else if (isTransformerName(item)) {
        transformerFunctionFinalized = responseFactories[item[0]](...item[1]);
    }
    return transformerFunctionFinalized;
}

registerResponseFactories([
    paginatedResponse,
    recordResponse
]);

