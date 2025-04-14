import _ from "lodash";
import {FieldTransform, FieldTransformerFactory} from "../types";

export const mapNumberToString: FieldTransformerFactory =
    (options?: { input?: string }): FieldTransform => {
        const {input} = options ?? {};
        return {
            description: "Convert a value from a number to a string",
            inputs: input ? [input] : undefined,
            transform: function (inputFields: string[], inputDictionary: Record<string, any>): string {
                return (_.get(inputDictionary, inputFields?.[0] as string) as number).toString();
            },
        }
    }
