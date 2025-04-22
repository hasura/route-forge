import {IConfig} from "../../src";
import * as http from "http";
import {fdxTransformers} from "./fdxapi.record.transformers";

const prePath = process.env.BASE_PATH ?? '/v1/api/rest';

export const Config: IConfig = {
    serverName: 'XYZ_BANK_FDX_API_Server',
    domainTransformer: fdxTransformers,
    majorVersion: 5,
    minorVersion: 0,
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
            input_validator: {
                schema: {
                    type: "object",
                    required: ["data"],
                    properties: {
                        data: {
                            type: "object",
                            properties: {
                                consumerBankingAccounts: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["accountNumber"],
                                        properties: {
                                            accountNumber: {
                                                type: "string"
                                            }
                                        },
                                        additionalProperties: true
                                    }
                                }
                            },
                            additionalProperties: true
                        }
                    }
                }
            },
            variables: {account_id: (headers["x-hasura-user-id"] as string)?.split(',').map(i => parseInt(i)).filter(i => !isNaN(i))},
            query: `
            query fdx_core_accounts($account_id: [ConsumerBanking_int_4!]!) {
              consumer_banking_accounts(
                where: {status: {_in: [ACTIVE]}, enterprise_account_id: {_in: $account_id}}
                order_by: {account_number: Asc}
              ) {
                consumer_banking_product {
                  product_name
                  product_type
                  base_interest_rate
                }
                consumer_banking_account_id
                account_number
                nickname
                display_name
                opening_day_balance
                current_balance
                available_balance
                interest_ytd
                annual_percentage_yield
                maturity_date
                term
                status
                currency {
                  code
                }
                enterprise_account {
                  enterprise_account_id
                }
              }
            }
      `,
            transformers: {
                out: [
                    "paginatedResponse", [{
                        resourceName: 'consumer_banking_accounts',
                        transformerKey: 'account',
                        itemsKey: 'accounts'
                    }]
                ],
            },
            outRecordTransformers: ['account']
        }
    ],
};
