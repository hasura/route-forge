export type FieldTransformer = (inputFields: string[], inputDictionary: Record<string, any>) => any

export interface FieldTransform {
    inputs?: string[],
    transform: FieldTransformer
    description: string
}

export interface FieldTransformers {
    [recordType: string]: FieldTransform
}

export interface RecordTransformer {
    description: string,
    inputDescription: string,
    outputDescription: string,
    pkNames: string[],
    fieldTransformers: FieldTransformers
}

export interface RecordTransformers {
    [recordType: string]: RecordTransformer
}

export interface DomainTransformer {
    recordTransformers: RecordTransformers
    description: string
}

export interface FieldTransformerFactory {
    (options?: Record<string, unknown>): FieldTransform;
}