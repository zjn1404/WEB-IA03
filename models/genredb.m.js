const ApplicationError = require("../error/cerror");
const errorCode = require("../error/errorCode");
require("dotenv").config();
const schema = process.env.DB_SCHEMA;
const db = require("./db")(schema);
const tbName = "genres";
const idField = "key";

const ec = errorCode.ErrorCode;

module.exports = {
  all: async () => {
    try {
      const genres = await db.all(tbName);
      return genres;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },
};
