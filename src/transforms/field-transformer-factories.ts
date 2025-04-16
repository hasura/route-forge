import {FieldTransform, FieldTransformerFactory, FieldTransformMetadata} from "../types";
import {mapNumberToStringFactory} from "./map-number-to-string";
import {mapStraightThroughFactory} from "./map-straight-through";
import {mapTodayDateStringFactory} from "./map-today-date-string";
import {mapRfcStringToDateStringFactory} from "./map-rfc-string-to-date-string";
import {mapStringToNumberNullsToZeroFactory} from "./map-string-to-number-nulls-to-zero";
import {mapStringToNumberFactory} from "./map-string-to-number";

export const fieldTransformerFactories: Record<string, FieldTransformerFactory> = {}

export const registerFieldTransformerFactories = (factories: FieldTransformerFactory[]) => {
    for (let factory of factories) {
        fieldTransformerFactories[factory.name] = factory
    }
    return fieldTransformerFactories;
}

function isFieldTransform(obj: any): obj is FieldTransform {
    return obj && typeof obj.description === 'string' &&
        (Array.isArray(obj.inputs) || obj.inputs === undefined) &&
        typeof obj.transform === 'function';
}

function isBareTransformerName(obj: any): obj is string[] {
    const typeMatched = Array.isArray(obj) && obj.length === 1 && typeof obj[0] === 'string';
    return typeMatched && fieldTransformerFactories[obj[0]] !== undefined;
}

function isTransformerName(obj: any): obj is string[] {
    const typeMatched = Array.isArray(obj) && obj.length === 2 &&
        typeof obj[0] === 'string' && Array.isArray(obj[1]);
    return typeMatched && fieldTransformerFactories[obj[0]] !== undefined;
}

export const getFieldTransformer = (item: FieldTransformMetadata): FieldTransform | undefined => {
    let fieldTransformFinalized: FieldTransform | undefined;
    if (isFieldTransform(item)) {
        fieldTransformFinalized = item;
    } else if (isBareTransformerName(item)) {
        fieldTransformFinalized = fieldTransformerFactories[item[0]]();
    } else if (isTransformerName(item)) {
        fieldTransformFinalized = fieldTransformerFactories[item[0]](...item[1]);
    }
    return fieldTransformFinalized;
}

registerFieldTransformerFactories([
    mapNumberToStringFactory,
    mapStraightThroughFactory,
    mapTodayDateStringFactory,
    mapRfcStringToDateStringFactory,
    mapStringToNumberNullsToZeroFactory,
    mapStringToNumberFactory
]);

