import {DomainTransformer, registerFieldTransformerFactories} from "../../src";
import {
    mapProductTypeToFdxAccountCategory,
    mapProductTypeToFdxAccountCategoryFactory
} from "./map-product-type-to-fdx-account.category";
import {mapConsumerBankingStatus, mapConsumerBankingStatusFactory} from "./fdxapi.map-consumer-banking-status";

registerFieldTransformerFactories([mapProductTypeToFdxAccountCategoryFactory, mapConsumerBankingStatusFactory]);

export const fdxTransformers: DomainTransformer = {
    description: "Convert consumerBanking.account to FDX account",
    recordTransformers: {
        'account': {
            description: "Map my bank deposit account to FDX API account",
            inputDescription: "Primarily from consumer_banking.accounts.",
            outputDescription: "FDX (Account | DepositAccount) type.",
            pkNames: ["consumer_banking_account_id"],
            fieldTransformers: {
                status: ["mapConsumerBankingStatus"],
                accountCategory: ["mapProductTypeToFdxAccountCategory", [{input: 'consumer_banking_product.product_type'}]],
                accountId: ["mapNumberToString", [{input: 'consumer_banking_account_id'}]],
                accountNumber: ["mapStraightThrough", [{input: 'account_number'}]],
                balanceAsOf: ["mapTodayDateString"],
                currentBalance: ["mapStringToNumberNullsToZero"],
                availableBalance: ["mapStringToNumberNullsToZero"],
                openingDayBalance: ["mapStringToNumberNullsToZero"],
                annualPercentageYield: ["mapStringToNumber"],
                interestYtd: ["mapStringToNumber"],
                term: ["mapStringToNumber", [{roundTo: 1}]],
                nickname: ["mapStraightThrough"],
                displayName: ["mapStraightThrough"],
                maturityDate: ["mapRfcStringToDateString"],
                "currency.currencyCode": ["mapStraightThrough", [{input: 'currency.code'}]],
                productName: ["mapStraightThrough", [{input: 'consumer_banking_product.product_name'}]]
            }
        },
        'account/lightweight': {
            description: "Map my bank deposit account to FDX API account lightweight variant.",
            inputDescription: "Primarily from consumer_banking.accounts.",
            outputDescription: "FDX (Account | DepositAccount) type.",
            pkNames: ["consumer_banking_account_id"],
            fieldTransformers: {
                status: ["mapConsumerBankingStatus"],
                accountCategory: ["mapProductTypeToFdxAccountCategory", [{input: 'consumer_banking_product.product_type'}]],
                accountId: ["mapNumberToString", [{input: 'accountNumber'}]],
                displayName: ["mapStraightThrough"],
                nickname: ["mapStraightThrough"],
                balanceAsOf: ["mapTodayDateString"],
                currentBalance: ["mapStringToNumberNullsToZero"],
                openingDayBalance: ["mapStringToNumberNullsToZero"],
            }
        }
    }
}