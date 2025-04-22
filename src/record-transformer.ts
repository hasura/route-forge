import {AppDataSource, FieldTransformationDetail, RecordTransformation} from './logging';
import {Request} from 'express';
import {RecordTransformer} from "./types";
import _ from "lodash";
import assert from "assert";
import {getFieldTransformer} from "./transforms";


export const recordTransformer = <T>(
    recordTransformer: RecordTransformer,
    record: Record<string, unknown>,
    req: Request
): T => {

    const transformation = new RecordTransformation();
    transformation.input_type = recordTransformer.inputDescription;
    transformation.output_type = recordTransformer.outputDescription;
    transformation.description = recordTransformer.description;
    transformation.field_details = [];

    if (req && (req as any).apiCall) {
        transformation.api_call = (req as any).apiCall;
    }

    if (recordTransformer.pkNames && recordTransformer.pkNames.length > 0) {
        transformation.primary_key_names = recordTransformer.pkNames.join(',');
        const pkValues = recordTransformer.pkNames.reduce((acc, key) => {
            return {...acc, [key]: _.get(record, key, null)};
        }, {} as Record<string, any>);
        transformation.primary_key_values = JSON.stringify(pkValues);
    }

    const transformedRecord = {} as Partial<T>;

    for (const key of Object.keys(recordTransformer.fieldTransformers)) {

        const fieldTransformer = getFieldTransformer(recordTransformer.fieldTransformers[key])
        assert(fieldTransformer)
        const {inputs, transform, description} = fieldTransformer;
        const inputFieldNames = inputs && inputs.length > 0 ? inputs : [key];
        const inputValues = inputFieldNames.map(name => _.get(record, name, null));
        const outputValue = transform(inputFieldNames, record);
        _.set(transformedRecord, key, outputValue);

        const serializeValue = (value: any) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return JSON.stringify(value);
        };

        inputFieldNames.forEach((inputFieldName, idx) => {
            transformation.field_details.push(
                Object.assign(new FieldTransformationDetail(), {
                    inputFieldName,
                    outputFieldName: key,
                    inputFieldValue: serializeValue(inputValues[idx]),
                    outputFieldValue: serializeValue(outputValue),
                    transformation,
                    transformDescription: description
                })
            );
        });
    }

    // Asynchronous logging handled internally
    AppDataSource.getRepository(RecordTransformation)
        .save(transformation)
        .catch(err => {
            console.error("Error saving transformation:", err);
        });

    return transformedRecord as T;
};
