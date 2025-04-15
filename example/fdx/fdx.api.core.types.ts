import {
    AccountResponse,
    AccountsResponse,
    ErrorResponse,
    RewardProgramsResponse,
    StatementsResponse,
    TransactionsResponse
} from "./fdxapi.core.interfaces";

export type FdxResponse =
    | RewardProgramsResponse
    | AccountResponse
    | AccountsResponse
    | TransactionsResponse
    | StatementsResponse
    | ErrorResponse