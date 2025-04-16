import {FieldTransform, FieldTransformerFactory} from "../types/";
import _, {round} from "lodash";

export function mapStringToNumber(options?: { input?: string, roundTo?: number }): FieldTransform {
        const {input, roundTo} = options || {};
        let description = `Converts ${input ?? "the input"} from a string to a number converting non-numerics to zeros.`
        if (roundTo) {
            description += ` Rounded to ${roundTo} decimals.`
        }
        return {
            inputs: input ? [input] : undefined,
            description,
            transform: (inputFields: string[], inputDictionary: Record<string, any>): number | undefined => {
                let result = parseFloat(_.get(inputDictionary, inputFields?.[0] as "", "0"))
                if (!isNaN(result) && roundTo) {
                    result = round(result, roundTo)
                }
                return isNaN(result) ? undefined : result;
            }
        }
    }

    export const mapStringToNumberFactory: FieldTransformerFactory = mapStringToNumber;
