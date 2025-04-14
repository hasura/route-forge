import {FieldTransform, FieldTransformerFactory} from "../types";
import _ from "lodash";

export const mapRfcStringToDateString: FieldTransformerFactory =
    (options?: { input?: string }): FieldTransform => {
        const {input} = options || {};
        let description = `Converts ${input ?? "the input"} from an any RFC date-like string to an RFC date string.`
        return {
            inputs: input ? [input] : undefined,
            description,
            transform: (inputFields: string[], inputDictionary: Record<string, any>): string | undefined => {
                let rfcDateTime = _.get(inputDictionary, inputFields?.[0] as string);
                if (rfcDateTime) {
                    const date = new Date(rfcDateTime);
                    const year = date.getUTCFullYear();
                    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                    const day = date.getUTCDate().toString().padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
                return undefined;
            }
        }
    }