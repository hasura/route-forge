import {FieldTransform, FieldTransformerFactory} from "../types";
import _ from "lodash";

export const mapStringToNumberNullsToZero: FieldTransformerFactory =
    (options?: { input?: string }): FieldTransform => {
        const {input} = options ?? {};
        return {
            inputs: input ? [input] : undefined,
            description: `Converts ${input ?? "the input"} from a string to a number converting non-numerics to zeros`,
            transform: (inputFields: string[], inputDictionary: Record<string, any>): number => {
                return parseFloat(_.get(inputDictionary, inputFields?.[0] as "", "0"))
            }
        }
    }