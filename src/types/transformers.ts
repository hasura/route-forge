export type FieldTransformer = (inputFields: string[], inputDictionary: Record<string, any>) => any

/**
 * Represents a field transformation operation that can be applied on input fields.
 * @interface FieldTransform
 * @property {string[]} inputs - The list of input fields on which the transformation will be applied. If undefined, the input key is the same as the output key.
 * @property {FieldTransformer} transform - The function that defines the transformation logic.
 * @property {string} description - A brief description of the field transformation operation.
 */
export interface FieldTransform {
    inputs?: string[],
    transform: FieldTransformer
    description: string
}

export type FieldTransformMetadata = FieldTransform | [string] | [string, any[]];

/**
 * Interface representing a collection of field transformers for different record types.
 * The key represents the output field key.
 */
export interface FieldTransformers {
    [recordType: string]: FieldTransformMetadata
}

/**
 * Interface for transforming records from one format to another.
 * A collection of field transformers.
 */
export interface RecordTransformer {
    description: string,
    inputDescription: string,
    outputDescription: string,
    pkNames: string[],
    fieldTransformers: FieldTransformers
}

/**
 * Interface for defining different transformers for various record types.
 * A collection of records transformers keyed by an identifier.
 */
export interface RecordTransformers {
    [recordType: string]: RecordTransformer
}

/**
 * Interface for a DomainTransformer object that includes record transformers and description.
 * This is a collection of record transformers that used within the server.
 *
 * @interface DomainTransformer
 * @property {RecordTransformers} recordTransformers - Object containing various record transformers.
 * @property {string} description - A string describing the purpose or functionality of the DomainTransformer.
 */
export interface DomainTransformer {
    recordTransformers: RecordTransformers
    description: string
}

/**
 * Interface for a factory function that creates FieldTransformer instances.
 *
 * @param {Record<string, unknown>} [options] - Optional options to be passed to the FieldTransform instance.
 * @returns {FieldTransform} - A FieldTransform instance created by the factory function.
 */
export interface FieldTransformerFactory {
    (options?: Record<string, unknown>): FieldTransform;
}