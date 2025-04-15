import {DomainTransformer} from "../../src";
import {fdxapiMapProductTypeToAccountCategory} from "./fdxapi.map-product-type-to-account-category";
import {mapConsumerBankingStatus} from "./fdxapi.map-consumer-banking-status";
import {
    mapNumberToString,
    mapRfcStringToDateString,
    mapStraightThrough,
    mapStringToNumber,
    mapStringToNumberNullsToZero,
    mapTodayDateString
} from "../../src";


export const fdxTransformers: DomainTransformer = {
    description: "Convert consumerBanking.account to FDX account",
    recordTransformers: {
        'account': {
            description: "Map my bank deposit account to FDX API account",
            inputDescription: "Primarily from consumer_banking.accounts.",
            outputDescription: "FDX (Account | DepositAccount) type.",
            pkNames: ["consumerBankingAccountId"],
            fieldTransformers: {
                status: mapConsumerBankingStatus(),
                accountCategory: fdxapiMapProductTypeToAccountCategory({input: 'consumerBankingProduct.productType'}),
                accountId: mapNumberToString({input: 'consumerBankingAccountId'}),
                accountNumber: mapStraightThrough({input: 'accountNumber'}),
                balanceAsOf: mapTodayDateString(),
                currentBalance: mapStringToNumberNullsToZero(),
                availableBalance: mapStringToNumberNullsToZero(),
                openingDayBalance: mapStringToNumberNullsToZero(),
                annualPercentageYield: mapStringToNumber(),
                interestYtd: mapStringToNumber(),
                term: mapStringToNumber({roundTo: 1}),
                nickname: mapStraightThrough(),
                displayName: mapStraightThrough(),
                maturityDate: mapRfcStringToDateString(),
                "currency.currencyCode": mapStraightThrough({input: 'currency.code'}),
                productName: mapStraightThrough({input: 'consumerBankingProduct.productName'})
            }
        },
        'account/lightweight': {
            description: "Map my bank deposit account to FDX API account lightweight variant.",
            inputDescription: "Primarily from consumer_banking.accounts.",
            outputDescription: "FDX (Account | DepositAccount) type.",
            pkNames: ["consumerBankingAccountId"],
            fieldTransformers: {
                status: mapConsumerBankingStatus(),
                accountCategory: fdxapiMapProductTypeToAccountCategory({input: 'consumerBankingProduct.productType'}),
                accountId: mapNumberToString({input: 'accountNumber'}),
                displayName: mapStraightThrough(),
                nickname: mapStraightThrough(),
                balanceAsOf: mapTodayDateString(),
                currentBalance: mapStringToNumberNullsToZero(),
                openingDayBalance: mapStringToNumberNullsToZero(),
            }
        }
    }
}