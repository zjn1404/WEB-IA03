const ApplicationError = require("../error/cerror");
const ErrorCode = require("../error/errorCode");
require("dotenv").config();

const ec = ErrorCode.ErrorCode;

const initOptions = {
  capSQL: true,
};

const pgp = require("pg-promise")(initOptions);
const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 30,
};

const db = pgp(cn);

module.exports = (schema) => {
  this.schema = schema;

  return {
    all: async (tbName) => {
      try {
        const data = await db.any(`SELECT * FROM "${this.schema}"."${tbName}"`);
        return data;
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    one: async (tbName, idField, id) => {
      try {
        const table = new pgp.helpers.TableName({
          table: tbName,
          schema: this.schema,
        });

        const data = await db.oneOrNone(
          `SELECT * FROM ${table} WHERE "${idField}"=$1`,
          id
        );
        return data;
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    allWithCondition: async (tbName, condition) => {
      try {
        const table = new pgp.helpers.TableName({
          table: tbName,
          schema: this.schema,
        });

        const data = await db.any(`SELECT * FROM ${table} WHERE ${condition}`);

        return data;
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    add: async (tbName, entity) => {
      try {
        const table = new pgp.helpers.TableName({
          table: tbName,
          schema: this.schema,
        });

        const sql = pgp.helpers.insert(entity, null, table);

        console.log(`${sql} RETURNING id`);

        const rs = await db.oneOrNone(`${sql} RETURNING *`);

        return rs;
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    update: async (tbName, entity) => {
      try {
        const table = new pgp.helpers.TableName({
          table: tbName,
          schema: this.schema,
        });

        const { CatID, ...updateFields } = entity;

        const sql =
          pgp.helpers.update(updateFields, null, table) +
          ` WHERE "CatID" = ${CatID}`;

        console.log(sql);

        const rs = await db.oneOrNone(`${sql} RETURNING *`);

        return rs;
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    delete: async (tbName, idField, id) => {
      try {
        const table = new pgp.helpers.TableName({
          table: tbName,
          schema: this.schema,
        });

        const sql = `DELETE FROM ${table} WHERE "${idField}"=$1`;
        await db.none(sql, id);
      } catch (e) {
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },

    any: async (sql) => {
      try {
        const data = await db.any(sql);
        return data;
      } catch (e) {
        console.log(e);
        throw new ApplicationError(ec.SERVER_ERROR);
      }
    },
  };
};
