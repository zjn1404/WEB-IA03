const ApplicationError = require("../error/cerror");
const errorCode = require("../error/errorCode");
require("dotenv").config();
const schema = process.env.DB_SCHEMA;
const db = require("./db")(schema);
const tbName = "moviereviews";
const idField = "id";

const ec = errorCode.ErrorCode;

module.exports = {
  getByMovieId: async (movieId) => {
    try {
      const sql = `
        SELECT *
        FROM "${schema}"."${tbName}"
        WHERE "movieid" = '${movieId}'
      `;
      const reviews = await db.any(sql);

      return reviews;
    } catch (err) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },
};
