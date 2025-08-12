

### Usage

- Install 

```
npm i @move.box/db-service
```

- Create service 

```
const dbservice = createDBService({
    host: DBConfig.DB_HOST,
    port: DBConfig.DB_PORT,
    user: DBConfig.DB_USER,
    password: DBConfig.DB_PASSWORD,
    database: DBConfig.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  })
```

- Check db connection or error 

```
try {
  await dbservice.checkStatusOrError()
} catch (error) {
  if (error instanceof DBError) {
    console.error('|ErrorMessage|', error.errorMessage())
    console.error('|Cause|', error.cause)
  } else {
    console.error(error)
  }
  process.exit(1)
}
```

- Query


```
try {
  const result = await dbservice.query<{ id: number, name: string }>(`select * from ${DBConfig.TABLES.table1} where id>=10 limit 10`)
  console.dir(result, { depth: 10 })
} catch (error) {
  console.error(error)
}
```

- Batch execute

```
try {
  await dbservice.batchExec([
    (connection) => {
      return dbservice.executeByConn(connection, `insert into ${DBConfig.TABLES.table1} (id, name) VALUES (10000001, "123123")`)
    },
    (connection) => {
      return dbservice.executeByConn(connection, `insert into ${DBConfig.TABLES.table2} (name, address) VALUES ('Move', 'Address online')`)
    },
  ])
} catch (error) {
  console.error(error)
}
```


##### Example

```

const DBConfig = {
  DB_HOST: "localhost",
  DB_PORT: 3306,
  DB_USER: "test",
  DB_PASSWORD: "123456",
  DB_NAME: "db_name",
  TABLES: {
    table1: "table_name_1",
    table2: "table_name_2"
  }
}

async function main() {
  const dbservice = createDBService({
    host: DBConfig.DB_HOST,
    port: DBConfig.DB_PORT,
    user: DBConfig.DB_USER,
    password: DBConfig.DB_PASSWORD,
    database: DBConfig.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  })

  try {
    await dbservice.checkStatusOrError()
  } catch (error) {
    if (error instanceof DBError) {
      console.error('|ErrorMessage|', error.errorMessage())
      console.error('|Cause|', error.cause)
    } else {
      console.error(error)
    }
    process.exit(1)
  }

  try {
    const result = await dbservice.query<{ id: number, name: string }>(`select * from ${DBConfig.TABLES.table1} where id>=10 limit 10`)
    console.dir(result, { depth: 10 })
  } catch (error) {
    console.error(error)
  }

  try {
    await dbservice.batchExec([
      (connection) => {
        return dbservice.executeByConn(connection, `insert into ${DBConfig.TABLES.table1} (id, name) VALUES (10000001, "123123")`)
      },
      (connection) => {
        return dbservice.executeByConn(connection, `insert into ${DBConfig.TABLES.table2} (name, address) VALUES ('Move', 'Address online')`)
      },
    ])
  } catch (error) {
    console.error(error)
  }

  await dbservice.close()

}

main()
```