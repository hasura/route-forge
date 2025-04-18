// Common Error interface used across many responses
export interface ErrorResponse {
    code: string;
    message: string;
    debugMessage: string;
}