const ApplicationError = require("../error/cerror");
const errorCode = require("../error/errorCode");
require("dotenv").config();
const schema = process.env.DB_SCHEMA;
const db = require("./db")(schema);
const tbName = "actors";
const idField = "id";

const ec = errorCode.ErrorCode;

module.exports = {
  getByName: async (name) => {
    try {
      const sql = `
        SELECT *
        FROM "${schema}"."${tbName}"
        WHERE "name" ILIKE '%${name}%'
      `
      const actors = await db.any(sql);

      return actors;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  getByMovieId: async (movieId) => {
    try {
      const sql = `
        SELECT a.*, ma.charactername
        FROM "${schema}"."${tbName}" a
        JOIN "${schema}"."movieactors" ma ON a."id" = ma."actorid"
        WHERE ma."movieid" = '${movieId}'
      `
      console.log(sql);
      const actors = await db.any(sql);

      return actors;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },
};
