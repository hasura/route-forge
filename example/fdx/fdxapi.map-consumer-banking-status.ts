import {AccountStatus} from "./fdxapi.core.enums";
import _ from "lodash";

import {FieldTransform, FieldTransformerFactory} from "../../src";

export function mapConsumerBankingStatus(options?: { input?: string }): FieldTransform {
    const {input} = options ?? {}
    return {
        inputs: input ? [input] : undefined,
        transform: (inputFields: string[], inputDictionary: Record<string, any>): AccountStatus => {
            const status = _.get(inputDictionary, inputFields?.[0] as string);
            switch (status) {
                case 'ACTIVE':
                    return AccountStatus.OPEN;

                case 'PENDING':
                    return AccountStatus.PENDINGOPEN;

                case 'INACTIVE':
                case 'SUSPENDED':
                case 'DORMANT':
                case 'FROZEN':
                    return AccountStatus.RESTRICTED;

                case 'CLOSED':
                case 'ARCHIVED':
                    return AccountStatus.CLOSED;

                default:
                    throw new Error(`Unknown account status: ${status}`);
            }
        },
        description: `Converts ${input ?? "the input"} from an Open Banking Status to an FDX status.
- for OB Status 'ACTIVE' return FDX Status '${AccountStatus.OPEN}'
- for OB Status 'PENDING' return FDX Status '${AccountStatus.PENDINGOPEN}'
- for OB Status 'INACTIVE','DORMANT','SUSPENDED','FROZEN' return FDX Status '${AccountStatus.RESTRICTED}'
- for OB Status 'CLOSED','ARCHIVED' return FDX Status '${AccountStatus.CLOSED}'
`
    }
}

export const mapConsumerBankingStatusFactory: FieldTransformerFactory = mapConsumerBankingStatus;