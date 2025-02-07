## Download All Dependencies

```bash
npm i
```

## Modify config in db.js or Use these Queries

```bash

USE MASTER
GO
CREATE DATABASE DB_EXPRESS
GO
CREATE LOGIN express_user WITH PASSWORD = "expresspass"
GO
USE DB_EXPRESS
GO
CREATE USER express_user FOR LOGIN express_user;
GO
ALTER ROLE db_owner ADD MEMBER express_user;
GO

--Check if TCP/IP is enabled on PORT 1433
--And SQL Login is allowed
--After changing any settings restart server
```

## Run Server

```bash
npm run dev
```
