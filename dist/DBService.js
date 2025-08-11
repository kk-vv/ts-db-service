"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = exports.DBService = void 0;
exports.createDBService = createDBService;
exports.queryDateToTimestamp = queryDateToTimestamp;
exports.queryTimestampFromDate = queryTimestampFromDate;
const promise_1 = __importDefault(require("mysql2/promise"));
const DBError_1 = require("./DBError");
Object.defineProperty(exports, "DBError", { enumerable: true, get: function () { return DBError_1.DBError; } });
function createDBService(config) {
    const pool = promise_1.default.createPool(config);
    return new DBService(pool);
}
class DBService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async checkStatusOrError() {
        try {
            const conn = await this.pool.getConnection();
            if (conn) {
                conn.release();
            }
            else {
                throw new DBError_1.DBError({ reason: `Connect get connection. \n ${this.pool}` });
            }
        }
        catch (error) {
            throw new DBError_1.DBError({ cause: error });
        }
    }
    async close() {
        await this.pool.end();
    }
    async query(sql, parameters) {
        const [rows] = await this.pool.query(sql, parameters);
        return rows;
    }
    async queryByConn(connection, sql, parameters) {
        const [rows] = await connection.query(sql, parameters);
        return rows;
    }
    async executeByConn(connection, sql, parameters) {
        await connection.execute(sql, parameters);
    }
    async batchExec(saveFunctions) {
        const connection = await this.pool.getConnection();
        if (connection) {
            try {
                await connection.beginTransaction();
                for (const saveFunc of saveFunctions) {
                    await saveFunc(connection);
                }
                await connection.commit();
            }
            catch (error) {
                await connection.rollback();
                throw new DBError_1.DBError({ cause: error });
            }
            finally {
                connection.release();
            }
        }
        else {
            throw new DBError_1.DBError({ reason: 'Cannot get connection' });
        }
    }
}
exports.DBService = DBService;
function queryDateToTimestamp(columnName, type = 'mysql', as) {
    switch (type) {
        case "psql":
            return `EXTRACT(EPOCH FROM ${columnName})::BIGINT AS ${as ?? columnName}`;
        case "mysql":
            return `UNIX_TIMESTAMP(${columnName}) AS ${as ?? columnName}`;
    }
}
function queryTimestampFromDate(date, type = 'mysql') {
    switch (type) {
        case "psql":
            return `TO_TIMESTAMP(${date})`;
        case "mysql":
            return `FROM_UNIXTIME(${date})`;
    }
}
exports.default = DBService;
