import {IConfig} from "../../src";
import {
    transformAccount,
    transformAccounts,
    transformRewardPrograms,
    transformTransactions
} from "./fdxapi.core.transformers";
import * as http from "http";
import {fdxTransformers} from "./fdxapi.record.transformers";

const prePath = process.env.BASE_PATH ?? '/v1/api/rest';

export const Config: IConfig = {
    serverName: 'XYZ_BANK_FDX_API_Server',
    domainTransformer: fdxTransformers,
    graphqlServer: {
        headers: {
            additional: {
                "Content-Type": "application/json",
            },
            forward: ["X-Hasura-Role", "Authorization", "X-Hasura-ddn-token", "X-Hasura-User-Id"],
        },
    },
    headers: {
        "hasura-m-auth": process.env.M_AUTH_KEY || '',
    },
    restifiedEndpoints: (headers: http.IncomingHttpHeaders) => [
        {
            path: `${prePath}/accounts`,
            methods: ["GET"],
            variables: {cb_enterpriseAccountId: (headers["x-hasura-user-id"] as string)?.split(',').map(i => parseInt(i)).filter(i => !isNaN(i))},
            query: `
        query FDX_Core_Accounts($cb_enterpriseAccountId: [ConsumerBanking_Int4!]!) {
          consumerBankingAccounts(
            where: {status: {_in: [ACTIVE]}, enterpriseAccountId: {_in: $cb_enterpriseAccountId}}
            order_by: {accountNumber: Asc}
          ) {
            consumerBankingProduct {
              productName
              productType
              baseInterestRate
            }
            consumerBankingAccountId
            accountNumber
            nickname
            displayName
            openingDayBalance
            currentBalance
            availableBalance
            interestYtd
            annualPercentageYield
            maturityDate
            term
            status
            currency {
              code
            }
            enterpriseAccount {
              enterpriseAccountId
            }
          }
        }
      `,
            transformers: {
                out: transformAccounts,
            },
            outRecordTransformers: ['account']
        },
        {
            path: `${prePath}/accounts/:accountId`,
            methods: ["GET"],
            query: `
        query accountsByAccountId($accountId: String!) {
          // Add actual query fields here when needed
        }
      `,
            transformers: {
                out: transformAccount,
            },
            outRecordTransformers: ['account']
        },
        {
            path: `${prePath}/accounts/:accountId/transactions`,
            methods: ["GET"],
            query: `
        query transactions($accountId: String!) { 
          // Add actual query fields here when needed
        }
      `,
            transformers: {
                out: transformTransactions,
            }
        },
        {
            path: `${prePath}/accounts/:accountId/reward-programs`,
            methods: ["GET"],
            query: `
        query rewardPrograms($accountId: String!) { 
          // Add actual query fields here when needed
        }
      `,
            transformers: {
                out: transformRewardPrograms,
            }
        },
    ],
};
