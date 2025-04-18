import {IConfig} from "../../src";
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
    service_authorization_headers: {
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
                out: [
                    "paginatedResponse", [{
                        resourceName: 'consumerBankingAccounts',
                        transformerKey: 'account',
                        itemsKey: 'accounts'
                    }]
                ],
            },
            outRecordTransformers: ['account']
        }
    ],
};
