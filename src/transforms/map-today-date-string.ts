import {FieldTransform, FieldTransformerFactory} from "../types";

export const mapTodayDateString: FieldTransformerFactory = (): FieldTransform => {
    return {
        transform: (_inputFields: string[], _inputDictionary: Record<string, any>): string => {
            return (new Date()).toISOString();
        },
        description: "Computed value of current UTC date and time."
    }
}
