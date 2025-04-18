import {Account, AccountResponse, RewardProgramsResponse, Statement, Transaction,} from "./fdxapi.core.interfaces";
import {ErrorResponse, PaginatedResponse} from "../../src";

export type FdxResponse =
    | RewardProgramsResponse
    | AccountResponse
    | PaginatedResponse<Account>
    | PaginatedResponse<Transaction>
    | PaginatedResponse<Statement>
    | ErrorResponse