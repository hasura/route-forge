// interfaces.ts

import {AccountCategory, BalanceType, DebitCreditMemo, TransactionStatus} from './fdxapi.core.enums';
import {ErrorResponse} from "../../src";


// Example for Account Statement Response
export interface Statement {
    accountId: string;
    statementId: string;
}

// Example for Transaction Response
export interface Transaction {
    accountCategory: AccountCategory;
    accountId: string;
    transactionId: string;
    postedTimestamp: string;
    description: string;
    debitCreditMemo: DebitCreditMemo;
    amount: number;
    payee: string;
    transactionStatus: TransactionStatus;
}


interface BaseAccount {
    accountCategory: AccountCategory;
    accountId: string;
    nickname?: string;
    status?: string;
    balanceAsOf?: string;
}

export interface DepositAccount extends BaseAccount {
    accountCategory: AccountCategory.DEPOSIT_ACCOUNT;
    currentBalance?: number;
    openingDayBalance?: number;
    availableBalance?: number;
    annualPercentageYield?: number;
    interestYtd?: number;
    term?: number;
    maturityDate?: string;
}

export interface LoanAccount extends BaseAccount {
    accountCategory: AccountCategory.LOAN_ACCOUNT;
    principalBalance?: number;
    escrowBalance?: number;
    originalPrincipal?: number;
    originatingDate?: string;
    loanTerm?: number;
    totalNumberOfPayments?: number;
    nextPaymentAmount?: number;
    nextPaymentDate?: string;
    paymentFrequency?: string;
    payOffAmount?: number;
}

export interface LineOfCreditAccount extends BaseAccount {
    accountCategory: AccountCategory.LOC_ACCOUNT;
    creditLine?: number;
    availableCredit?: number;
    currentBalance?: number;
    nextPaymentAmount?: number;
    nextPaymentDate?: string;
    minimumPaymentAmount?: number;
}

export interface InvestmentAccount extends BaseAccount {
    accountCategory: AccountCategory.INVESTMENT_ACCOUNT;
    currentValue?: number;
    availableCashBalance?: number;
    marginBalance?: number;
    shortBalance?: number;
}

export interface InsuranceAccount extends BaseAccount {
    accountCategory: AccountCategory.INSURANCE_ACCOUNT;
    policyPremium?: number;
    policyStartDate?: string;
    policyEndDate?: string;
    policyCoverageAmount?: number;
}

export interface AnnuityAccount extends BaseAccount {
    accountCategory: AccountCategory.ANNUITY_ACCOUNT;
    payoutType?: 'IMMEDIATE' | 'DEFERRED';
    payoutAmount?: number;
    payoutStartDate?: string;
    payoutEndDate?: string;
}

export interface CommercialAccount extends BaseAccount {
    accountCategory: AccountCategory.COMMERCIAL_ACCOUNT;
    currentLedgerBalance?: number;
    openingLedgerBalance?: number;
    closingLedgerBalance?: number;
    openingAvailableBalance?: number;
    closingAvailableBalance?: number;
}

export interface DigitalWallet extends BaseAccount {
    accountCategory: AccountCategory.DIGITAL_WALLET;
    currentBalance?: number;
    openingDayBalance?: number;
    availableBalance?: number;
    annualPercentageYield?: number;
}

// Union type representing all possible account types
export type Account =
    | DepositAccount
    | LoanAccount
    | LineOfCreditAccount
    | InvestmentAccount
    | InsuranceAccount
    | AnnuityAccount
    | CommercialAccount
    | DigitalWallet;

export interface AccountResponse {
    account: Account;
}

// Example for Reward Programs Response
interface RewardProgram {
    programName: string;
    rewardProgramId: string;
    programUrl: string;
    memberships: Array<{
        accountIds: string[];
        businessOrConsumer: string;
        customerId: string;
        memberId: string;
        memberNumber: string;
        memberTier: string;
        balances: Array<Balance>;
    }>;
}

export interface RewardProgramsResponse {
    rewardPrograms: RewardProgram[];
}

export interface Balance {
    name: string; // Name of the balance
    type: BalanceType; // e.g., POINTS, CASHBACK
    balance: number; // Total balance available
    accruedYtd: number; // Accrued year-to-date
    redeemedYtd: number; // Redeemed year-to-date
    qualifying: boolean; // If the balance qualifies for rewards
}

// Example of the response interface for error status codes like 404 or 500
interface ErrorResponse400 extends ErrorResponse {
    additionalInfo: string;
}
