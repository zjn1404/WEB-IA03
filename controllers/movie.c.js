const movieModel = require("../models/moviedb.m.js");
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");

const ec = errorCode.ErrorCode;

const getTopBoxOffice = async (req, res) => {
  const limit = 15;
  try {
    const topBoxOffices = await movieModel.topBoxOffice(limit);

    const paginationResult = {
      movies: topBoxOffices,
      total: limit,
    };

    res.json({ paginationResult });
  } catch (e) {
    console.error(e);
    throw new ApplicationError(ec.SERVER_ERROR);
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

const getTopRating = async (req, res) => {
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
    console.error(e);
    throw new ApplicationError(ec.SERVER_ERROR);
  }
};

const getTopFavorite = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topFavorites = await movieModel.topFavorite(limit);
    const topFavoriteWithGenres = topFavorites.map(async (movie) => {
      movie.genres = await getGenres(movie.id);
      return movie;
    });

    let result = await Promise.all(topFavoriteWithGenres);

    result = result.map((movie) => {
      movie.genres = processGenres(movie.genres);
      return movie;
    });

    res.json({ result });
  } catch (e) {
    console.error(e);
    throw new ApplicationError(ec.SERVER_ERROR);
  }
}

const getByNameOrGenres = async (req, res) => {
  try {
    const name = req.query.name;
    const genres = req.query.genres;

    const movies = await movieModel.getByNameOrGenres(name, genres);

    res.json({ movies });
  } catch (e) {
    console.error(e);
    throw new ApplicationError(ec.SERVER_ERROR);
  }
}

module.exports = {
  getTopBoxOffice,
  getTopRating,
  getTopFavorite,
  getByNameOrGenres,
};
