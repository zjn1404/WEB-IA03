const ApplicationError = require("../error/cerror");
const errorCode = require("../error/errorCode");
require("dotenv").config();
const schema = process.env.DB_SCHEMA;
const db = require("./db")(schema);
const tbName = "movies";
const idField = "id";

const ec = errorCode.ErrorCode;

module.exports = {
  all: async () => {
    try {
      const movies = await db.all(tbName);
      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  one: async (id) => {
    try {
      const movie = await db.one(tbName, idField, id);
      return movie;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  allByTitle: async (title) => {
    try {
      const condition = `"fulltitle" LIKE '%${title}%'`;
      const movies = await db.allWithCondition(tbName, condition);

      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  allByGenre: async (genre) => {
    try {
      const sql = `
        SELECT *
        FROM "${schema}"."movies" m
        JOIN "${schema}"."moviegenres" mg ON mg."movieid" = m."id"
        JOIN "${schema}"."genres" g ON g."key" = mg."genrekey"
        WHERE g."value" = '${genre}'
      `;
      const movies = await db.any(sql);
      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  topBoxOffice: async (limit) => {
    try {
      const sql = `
        SELECT 
            m.*,
            (COALESCE(bo.cumulativeworldwidegross, 0) + 
            COALESCE(bo.grossusa, 0) + 
            COALESCE(bo.openingweekendusa, 0) - 
            COALESCE(bo.budget, 0)) AS revenueprofit
        FROM "${schema}"."movieboxoffice" bo
        JOIN "${schema}"."movies" m ON bo."movieid" = m."id"
        ORDER BY "revenueprofit" DESC
        LIMIT ${limit};
      `;
      console.log('top box office sql:', sql);
      const movies = await db.any(sql);

      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  topRating: async (limit) => {
    try {
      const sql = `
        SELECT 
        m.*
        FROM "${schema}"."movieratings" rt
        JOIN "${schema}"."movies" m ON rt."movieid" = m."id"
        ORDER BY imdb DESC
        LIMIT ${limit}
      `;
      console.log('top rating sql:', sql);
      const movies = await db.any(sql);

      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  getGenres: async (movieId) => {
    try {
      const sql = `
        SELECT g."value"
        FROM "${schema}"."moviegenres" mg
        JOIN "${schema}"."genres" g ON mg."genrekey" = g."key"
        WHERE mg."movieid" = '${movieId}'
      `;
      
      console.log('get genres sql:', sql);
      const genres = await db.any(sql);

      return genres;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  topFavorite: async (limit) => {
    try {
      const sql = `
        SELECT 
        m.*
        FROM "${schema}"."moviefavorites" fav
        JOIN "${schema}"."movies" m ON fav."movieid" = m."id"
        ORDER BY fav DESC
        LIMIT ${limit}
      `;

      console.log('top favorite sql:', sql);
      const movies = await db.any(sql);

      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },

  getByNameOrGenres: async (name, genres) => {
    try {
      let condition = "";
      if (name) {
        condition += `m."fulltitle" LIKE '%${name}%'`;
      }

      if (genres) {
        if (name) {
          condition += " OR ";
        }

        condition += `g."value" IN (${genres
          .split(",")
          .map((genre) => `'${genre}'`)
          .join(",")})`;
      }

      const sql = `
        SELECT m.*
        FROM "${schema}"."movies" m
        JOIN "${schema}"."moviegenres" mg ON mg."movieid" = m."id"
        JOIN "${schema}"."genres" g ON g."key" = mg."genrekey"
        WHERE ${condition}
      `;
      console.log(sql);

      const movies = await db.any(sql);

      return movies;
    } catch (e) {
      throw new ApplicationError(ec.SERVER_ERROR);
    }
  },
};
