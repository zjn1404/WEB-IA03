const movieModel = require("../models/moviedb.m.js");
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");

const ec = errorCode.ErrorCode;

const getTopBoxOffice = async (req, res, next) => {
  const limit = 15;
  try {
    const topBoxOffices = await movieModel.topBoxOffice(limit);

    const paginationResult = {
      movies: topBoxOffices,
      total: limit,
    };

    res.json({ paginationResult });
  } catch (e) {
    console.error(e.message);
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const getGenres = async (movieId) => {
  try {
    const genres = await movieModel.getGenres(movieId);
    return genres;
  } catch (e) {
    console.error(e);
    throw new ApplicationError(ec.SERVER_ERROR);
  }
};

const processGenres = (genres) => {
  if (genres.length === 0) {
    return "";
  }
  return "[" + genres.join(",") + "]";
};

const getTopRating = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topRatings = await movieModel.topRating(limit);
    const topRatingWithGenres = topRatings.map(async (movie) => {
      movie.genres = await getGenres(movie.id);
      return movie;
    });

    let result = await Promise.all(topRatingWithGenres);

    result = result.map((movie) => {
      movie.genres = processGenres(movie.genres);
      return movie;
    });

    res.json({ result });
  } catch (e) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const getTopFavorite = async (req, res, next) => {
  const limit = 15;
  try {
    const topFav = await movieModel.topBoxOffice(limit);

    const paginationResult = {
      movies: topFav,
      total: limit,
    };

    res.json({ paginationResult });
  } catch (e) {
    console.error(e.message);
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const getByNameOrGenres = async (req, res, next) => {
  const limit = 9;
  try {
    const keyword = req.query.keyword;
    const page = req.query.page || 1;

    let movies = await movieModel.getByNameOrGenres(keyword);
    const totalPages = Math.ceil(movies.length / limit);
    movies = movies.slice((page - 1) * limit, page * limit);

    movies.map((m) => {
      m.value = m.value == null ? '' : m.value;
    })

    res.render("home/moviesearch", {
      movies: movies,
      page: page,
      totalPages: totalPages
    });
  } catch (e) {
    console.error(e);
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

module.exports = {
  getTopBoxOffice,
  getTopRating,
  getTopFavorite,
  getByNameOrGenres,
};
