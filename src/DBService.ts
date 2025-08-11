import mysql, { PoolOptions } from 'mysql2/promise'
import { DBError } from './DBError'

export function createDBService(config: PoolOptions) {
  const pool = mysql.createPool(config)
  return new DBService(pool)
}

export class DBService {

  pool: mysql.Pool

  constructor(pool: mysql.Pool) {
    this.pool = pool
  }

  async checkStatusOrError() {
    try {
      const conn = await this.pool.getConnection()
      if (conn) {
        conn.release()
      } else {
        throw new DBError({ reason: `Connect get connection. \n ${this.pool}` })
      }
    } catch (error) {
      throw new DBError({ cause: error })
    }
  }

  async close() {
    await this.pool.end()
  }

  async query<T>(sql: string, parameters?: unknown[]): Promise<T[]> {
    const [rows] = await this.pool.query(sql, parameters)
    return rows as T[]
  }

  async queryByConn<T>(connection: mysql.Connection, sql: string, parameters?: unknown[]): Promise<T[]> {
    const [rows] = await connection.query(sql, parameters)
    return rows as T[]
  }

  async executeByConn(connection: mysql.Connection, sql: string, parameters?: unknown[]) {
    await connection.execute(sql, parameters)
  }

  async batchExec(saveFunctions: Array<(connection: mysql.PoolConnection) => Promise<void>>) {
    const connection = await this.pool.getConnection()
    if (connection) {
      try {
        await connection.beginTransaction()
        for (const saveFunc of saveFunctions) {
          await saveFunc(connection)
        }
        await connection.commit()
      } catch (error) {
        await connection.rollback()
        throw new DBError({ cause: error })
      } finally {
        connection.release()
      }
    } else {
      throw new DBError({ reason: 'Cannot get connection' })
    }
  }
}

export function queryDateToTimestamp(columnName: string, type: 'psql' | 'mysql' = 'mysql', as?: string) {
  switch (type) {
    case "psql":
      return `EXTRACT(EPOCH FROM ${columnName})::BIGINT AS ${as ?? columnName}`
    case "mysql":
      return `UNIX_TIMESTAMP(${columnName}) AS ${as ?? columnName}`
  }
}

export function queryTimestampFromDate(date: any | number | bigint, type: 'psql' | 'mysql' = 'mysql') {
  switch (type) {
    case "psql":
      return `TO_TIMESTAMP(${date})`
    case "mysql":
      return `FROM_UNIXTIME(${date})`
  }
}