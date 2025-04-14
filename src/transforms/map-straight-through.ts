import {FieldTransform, FieldTransformerFactory} from "../types";
import _, {isNull} from "lodash";

export const mapStraightThrough: FieldTransformerFactory =
    (options?: { input?: string, nullsToUndefined?: boolean }): FieldTransform => {
        const {input, nullsToUndefined} = options ?? {};
        return {
            inputs: input ? [input] : undefined,
            description: "Maps straight-through." + (nullsToUndefined ? " However null values are removed from response." : ""),
            transform: (inputFields: string[], inputDictionary: Record<string, any>): any => {
                const result = _.get(inputDictionary, inputFields?.[0] as "")
                if (nullsToUndefined && isNull(result)) {
                    return undefined
                }
                return result;
            }
        }
    }