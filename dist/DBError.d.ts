export declare class DBError extends Error {
    reason?: string;
    constructor(option?: {
        name?: string;
        reason?: string;
        cause?: unknown;
    });
    errorMessage(): string;
}
