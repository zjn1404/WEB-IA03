const movieModel = require("../models/moviedb.m.js");
const actorModel = require("../models/actordb.m.js");
const directorModel = require("../models/directordb.m.js");
const reviewModel = require("../models/reviewdb.m.js");
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

    movies.forEach((m) => {
      m.value = m.value == null ? "" : m.value;
    });

    res.render("home/moviesearch", {
      movies: movies,
      page: page,
      totalPages: totalPages,
    });
  } catch (e) {
    console.error(e);
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const processRatings = async (ratings) => {
  if (!ratings || ratings.length === 0) {
    return "";
  }

  return `imdb: ${ratings.imdb || "no data"}, metacritic: ${ratings.metacritic || "no data"}, rottenTomatoes: ${ratings.rottentomatoes || "no data"}, filmaffinity: ${ratings.filmaffinity || "no data"}`;
}

const processDirectors = async (directors) => {
  if (!directors || directors.length === 0) {
    return "";
  }

  return directors.map((director) => {
    return director.name;
  }).join(", ");
}

const getById = async (req, res, next) => {
  try {
    const movie = await movieModel.one(req.query.id);
    if (movie == null) {
      return next(new ApplicationError(ec.MOVIE_NOT_FOUND));
    }

    const genres = await getGenres(movie.id);
    movie.genres = processGenres(genres);

    const ratings = await movieModel.getRatings(movie.id);
    movie.ratings = await processRatings(ratings);

    const directors = await directorModel.getByMovieId(movie.id);
    movie.directors = await processDirectors(directors);

    const actors = await actorModel.getByMovieId(movie.id);
    const reviews = await reviewModel.getByMovieId(movie.id);
    reviews.forEach( (review) => {
      review.reviewdate = review.reviewdate.toISOString().split('T')[0];
    })

    return res.render("home/moviedetail", {
      movie: movie,
      actors: actors,
      reviews: reviews,
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
  getById,
};
