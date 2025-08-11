import mysql, { PoolOptions } from 'mysql2/promise';
import { DBError } from './DBError';
export declare function createDBService(config: PoolOptions): DBService;
export declare class DBService {
    private pool;
    constructor(pool: mysql.Pool);
    checkStatusOrError(): Promise<void>;
    close(): Promise<void>;
    query<T>(sql: string, parameters?: unknown[]): Promise<T[]>;
    queryByConn<T>(connection: mysql.Connection, sql: string, parameters?: unknown[]): Promise<T[]>;
    executeByConn(connection: mysql.Connection, sql: string, parameters?: unknown[]): Promise<void>;
    batchExec(saveFunctions: Array<(connection: mysql.PoolConnection) => Promise<void>>): Promise<void>;
}
export declare function queryDateToTimestamp(columnName: string, type?: 'psql' | 'mysql', as?: string): string;
export declare function queryTimestampFromDate(date: any | number | bigint, type?: 'psql' | 'mysql'): string;
export { DBError };
export default DBService;
