// transformers.ts
import {
    Account,
    AccountResponse,
    AccountsResponse,
    DepositAccount,
    ErrorResponse,
    RewardProgramsResponse,
    TransactionsResponse
} from './fdxapi.core.interfaces';
import {ExecutionResult} from "graphql/execution";
import {recordTransformer} from "../../src";
import {Request} from "express";
import _ from "lodash";
import {RecordTransformers, TransformerFunction} from "../../src";

// Function stub to transform input to match TransactionsResponse interface
export function transformTransactions(_params: Record<string, any>, _input: any, _req: Request, _recordTransformers: RecordTransformers): TransactionsResponse {
    // To be implemented
    return {} as TransactionsResponse;
}

// Function stub to transform input to match AccountResponse interface
export function transformAccount(_params: Record<string, any>, _input: any, _req: Request, _recordTransformers: RecordTransformers): AccountResponse {
    // To be implemented
    return {} as AccountResponse;
}

export const transformAccounts: TransformerFunction = (
    params: Record<string, any>,
    graphqlResponse: ExecutionResult,
    req: Request,
    recordTransformers
): AccountsResponse | ErrorResponse => {

    if (graphqlResponse.errors) {
        return {
            code: graphqlResponse.errors[0].name,
            message: graphqlResponse.errors[0].message,
            debugMessage: ""
        }
    }
    if (!graphqlResponse.data) {
        return {
            accounts: [] as Account[],
            page: {
                total: 0,
            },
        };
    }

    const accountsData = _.get(graphqlResponse.data, 'consumerBankingAccounts') as Record<string, unknown>[]
    const offset = parseInt(params.offset, 10) || 0;
    const limit = parseInt(params.limit, 10) || accountsData.length;
    const resultType = params.resultType;
    const fieldTransformers = recordTransformers[resultType == 'lightweight' ? 'account/lightweight' : 'account']
    const accounts: Account[] = accountsData.map((account) => recordTransformer<DepositAccount>(fieldTransformers, account, req));
    const paginatedAccounts = accounts.slice(offset, offset + limit);

    return {
        accounts: paginatedAccounts,
        page: {
            total: accounts.length,
            nextOffset: offset + limit < accounts.length ? (offset + limit).toString() : undefined,
        },
        links: offset + limit < accounts.length ? {
            next: {
                href: `/accounts?offset=${offset + limit}&limit=${limit}`
            }
        } : undefined
    };
};

// Function stub to transform input to match RewardProgramsResponse interface
export function transformRewardPrograms(_params: Record<string, any>, _input: any, _req: Request, _recordTransformers: RecordTransformers): RewardProgramsResponse {
    // To be implemented
    return {} as RewardProgramsResponse;
}


