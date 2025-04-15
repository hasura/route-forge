import {FieldTransform} from "../../src";
import {AccountCategory} from "./fdxapi.core.enums";
import _ from "lodash";

export const fdxapiMapProductTypeToAccountCategory = (options: { input?: string }): FieldTransform => {
    const {input} = options;
    return {
        description: `Convert a product type to an FDX account category based on the following mapping rules:
- For product types 'CHECKING', 'SAVINGS', 'STUDENT', 'YOUTH', 'SENIOR', 'PREMIUM', 'FOREIGN_CURRENCY', and 'SPECIALIZED', the returned account category is '${AccountCategory.DEPOSIT_ACCOUNT}'.
- For product types 'MONEY_MARKET', 'CERTIFICATE_OF_DEPOSIT', and 'IRA', the returned account category is '${AccountCategory.INVESTMENT_ACCOUNT}'.
- For the 'HSA' product type, the returned account category is '${AccountCategory.INSURANCE_ACCOUNT}'.
- For product types 'BUSINESS_CHECKING' and 'BUSINESS_SAVINGS', the returned account category is '${AccountCategory.COMMERCIAL_ACCOUNT}'.
- If the provided product type doesn't match any of the predefined types, an Error is thrown indicating 'Unknown ProductType'."
`,
        inputs: input ? [input] : undefined,
        transform: function (inputFields: string[], inputDictionary: Record<string, any>): AccountCategory {
            const productType = _.get(inputDictionary, inputFields?.[0] as string);
            switch (productType) {
                case 'CERTIFICATE_OF_DEPOSIT':
                case 'CHECKING':
                case 'SAVINGS':
                case 'STUDENT':
                case 'YOUTH':
                case 'SENIOR':
                case 'PREMIUM':
                case 'FOREIGN_CURRENCY':
                case 'SPECIALIZED':
                    return AccountCategory.DEPOSIT_ACCOUNT;

                case 'MONEY_MARKET':
                case 'IRA':
                    return AccountCategory.INVESTMENT_ACCOUNT;

                case 'HSA':
                    return AccountCategory.INSURANCE_ACCOUNT;

                case 'BUSINESS_CHECKING':
                case 'BUSINESS_SAVINGS':
                    return AccountCategory.COMMERCIAL_ACCOUNT;

                default:
                    throw new Error(`Unknown ProductType: ${productType}`);
            }
        }
    }
}
