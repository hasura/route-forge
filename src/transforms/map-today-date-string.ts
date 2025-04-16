import {FieldTransform, FieldTransformerFactory} from "../types";

export function mapTodayDateString(): FieldTransform {
    return {
        transform: (_inputFields: string[], _inputDictionary: Record<string, any>): string => {
            return (new Date()).toISOString();
        },
        description: "Computed value of current UTC date and time."
    }
}

export const mapTodayDateStringFactory: FieldTransformerFactory = mapTodayDateString;
