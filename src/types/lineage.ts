// lineage-types.ts
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

export const LineageFieldSchema: OpenAPIV3.SchemaObject = {
    type: "object",
    required: [
        "fieldLineageId",
        "fieldName",
        "description",
        "inputFields"
    ],
    properties: {
        fieldLineageId: {
            type: "string",
            description: "Unique identifier for the field lineage"
        },
        fieldName: {
            type: "string",
            description: "Name of the output field"
        },
        description: {
            type: "string",
            description: "Description of the field transformation/mapping"
        },
        inputFields: {
            type: "string",
            description: "Source field(s) that map to this output field"
        }
    }
};

export const LineageRecordSchema: OpenAPIV3.SchemaObject = {
    type: "object",
    required: [
        "recordLineageId",
        "inputType",
        "outputType",
        "description",
        "pkNames",
        "fields"
    ],
    properties: {
        recordLineageId: {
            type: "string",
            description: "Unique identifier for the record lineage"
        },
        inputType: {
            type: "string",
            description: "Description of the input data type/source"
        },
        outputType: {
            type: "string",
            description: "Description of the output data type/destination"
        },
        description: {
            type: "string",
            description: "Description of the record lineage"
        },
        inputDescription: {
            type: "string",
            nullable: true,
            description: "Additional description of the input data"
        },
        outputDescription: {
            type: "string",
            nullable: true,
            description: "Additional description of the output data"
        },
        pkNames: {
            type: "string",
            description: "Primary key field names used for record identification"
        },
        fields: {
            type: "array",
            description: "List of field lineages for this record",
            items: {
                $ref: "#/components/schemas/LineageField"
            }
        }
    }
};

export const LineageApiSchema: OpenAPIV3.SchemaObject = {
    type: "object",
    required: [
        "apiLineageId",
        "serverName",
        "apiCall",
        "description",
        "startDate",
        "records"
    ],
    properties: {
        apiLineageId: {
            type: "string",
            description: "Unique identifier for the API lineage"
        },
        serverName: {
            type: "string",
            description: "Name of the server hosting the API"
        },
        apiCall: {
            type: "string",
            description: "API endpoint path"
        },
        description: {
            type: "string",
            description: "Description of the API lineage"
        },
        startDate: {
            type: "string",
            format: "date-time",
            description: "Date when the API lineage started"
        },
        endDate: {
            type: "string",
            nullable: true,
            format: "date-time",
            description: "Date when the API lineage ended, null if still active"
        },
        updatedAt: {
            type: "string",
            nullable: true,
            format: "date-time",
            description: "Date when the API lineage was last updated"
        },
        records: {
            type: "array",
            description: "List of record lineages associated with this API",
            items: {
                $ref: "#/components/schemas/LineageRecord"
            }
        }
    }
};

export const LineageResponseSchema: OpenAPIV3.SchemaObject = {
    type: "array",
    items: {
        $ref: "#/components/schemas/LineageApi"
    }
};

// Type definitions for the actual TypeScript interfaces
export interface LineageField {
    fieldLineageId: string;
    fieldName: string;
    description: string;
    inputFields: string;
}

export interface LineageRecord {
    recordLineageId: string;
    inputType: string;
    outputType: string;
    description: string;
    inputDescription: string | null;
    outputDescription: string | null;
    pkNames: string;
    fields: LineageField[];
}

export interface LineageApi {
    apiLineageId: string;
    serverName: string;
    apiCall: string;
    description: string;
    startDate: string;
    endDate: string | null;
    updatedAt: string | null;
    records: LineageRecord[];
}

export type LineageResponse = LineageApi[];