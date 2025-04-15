// enums.ts

// Account Categories
export enum AccountCategory {
    ANNUITY_ACCOUNT = "ANNUITY_ACCOUNT",
    COMMERCIAL_ACCOUNT = "COMMERCIAL_ACCOUNT",
    DEPOSIT_ACCOUNT = "DEPOSIT_ACCOUNT",
    DIGITAL_WALLET = "DIGITAL_WALLET",
    INSURANCE_ACCOUNT = "INSURANCE_ACCOUNT",
    INVESTMENT_ACCOUNT = "INVESTMENT_ACCOUNT",
    LOAN_ACCOUNT = "LOAN_ACCOUNT",
    LOC_ACCOUNT = "LOC_ACCOUNT",
}

// Account Statuses
export enum AccountStatus {
    CLOSED = "CLOSED",
    DELINQUENT = "DELINQUENT",
    NEGATIVECURRENTBALANCE = "NEGATIVECURRENTBALANCE",
    OPEN = "OPEN",
    PAID = "PAID",
    PENDINGCLOSE = "PENDINGCLOSE",
    PENDINGOPEN = "PENDINGOPEN",
    RESTRICTED = "RESTRICTED",
}

// Balance Types
export enum BalanceType {
    ASSET = "ASSET",
    LIABILITY = "LIABILITY",
}

// Debit/Credit Memo Types
export enum DebitCreditMemo {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT",
    MEMO = "MEMO",
}

// Transaction Statuses
export enum TransactionStatus {
    AUTHORIZATION = "AUTHORIZATION",
    MEMO = "MEMO",
    PENDING = "PENDING",
    POSTED = "POSTED",
}

// Payment Network Types
export enum PaymentNetworkType {
    CA_ACSS = "CA_ACSS",
    CA_LVTS = "CA_LVTS",
    US_ACH = "US_ACH",
    US_CHIPS = "US_CHIPS",
    US_FEDNOW = "US_FEDNOW",
    US_FEDWIRE = "US_FEDWIRE",
    US_RTP = "US_RTP",
}
