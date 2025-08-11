"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
class DBError extends Error {
    reason;
    constructor(option) {
        let reason = option?.reason;
        if (!reason && option?.cause) {
            reason = option.cause.message || option.cause.msg || `${option.cause}`;
        }
        super(reason ?? 'DB errror');
        this.cause = option?.cause;
        this.name = option?.name || 'DB errror';
        this.reason = reason;
    }
    errorMessage() {
        return `${this.name}|${this.reason}`;
    }
}
exports.DBError = DBError;
