const ApplicationError = require("../error/cerror");
const errorCode = require("../error/errorCode");
const { getByMovieId } = require("./actordb.m");
require("dotenv").config();
const schema = process.env.DB_SCHEMA;
const db = require("./db")(schema);
const tbName = "creators";
const idField = "id";

const ec = errorCode.ErrorCode;

module.exports = {
  all: async () =>{
    try {
      const creators = await db.all(tbName);
      return creators;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  getByName: async (name) => {
    try {
      const sql = `
        SELECT c.*, a.imageurl
        FROM "${schema}"."${tbName}" c
        LEFT JOIN "${schema}"."actors" a
        ON c."id" = a."id"
        WHERE c."name" ILIKE '%${name}%'
      `
      const creators = await db.any(sql);

      return creators;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  getByMovieId: async (movieId) => {
    try {
      const sql = `
        SELECT c.*, a.imageurl
        FROM "${schema}"."${tbName}" c
        LEFT JOIN "${schema}"."actors" a
        ON c."id" = a."id"
        JOIN "${schema}"."moviescreators" mc
        ON c."id" = mc."creatorid"
        WHERE mc."movieid" = '${movieId}'
      `
      const creators = await db.any(sql);

      return creators;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  }
};
