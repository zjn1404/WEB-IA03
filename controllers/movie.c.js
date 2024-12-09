const movieModel = require("../models/moviedb.m.js");
const actorModel = require("../models/actordb.m.js");
const directorModel = require("../models/directordb.m.js");
const genreModel = require("../models/genredb.m.js");
const reviewModel = require("../models/reviewdb.m.js");
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_SECRET_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const ec = errorCode.ErrorCode;

const getAddMoviePage = async (req, res, next) => {
  const genres = await genreModel.all();
  const actors = await actorModel.all();
  const creators = await directorModel.all();
  res.render("home/addmovie", {
    genres: genres,
    actors: actors,
    creators: creators,
  });
};

const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const streamify = require("stream");
    const bufferStream = streamify.Readable.from([file.buffer]);
    bufferStream.pipe(uploadStream);
  });
};

const addMovie = async (req, res, next) => {
  try {
    const title = req.body.title;
    if (!title) {
      return next(new ApplicationError(ec.MOVIE_TITLE_REQUIRED));
    }

    const fulltitle = req.body.fulltitle;
    if (!fulltitle) {
      return next(new ApplicationError(ec.MOVIE_FULLTITLE_REQUIRED));
    }

    const releasedate = req.body.releasedate;
    if (!releasedate) {
      return next(new ApplicationError(ec.MOVIE_RELEASEDATE_REQUIRED));
    }

    const year = req.body.year;
    if (!year) {
      return next(new ApplicationError(ec.MOVIE_YEAR_REQUIRED));
    }

    const plot = req.body.plot;
    if (!plot) {
      return next(new ApplicationError(ec.MOVIE_PLOT_REQUIRED));
    }

    const genres = req.body.genres;
    if (!genres) {
      return next(new ApplicationError(ec.MOVIE_GENRES_REQUIRED));
    }

    const actors = req.body.actors;
    if (!actors) {
      return next(new ApplicationError(ec.MOVIE_ACTORS_REQUIRED));
    }

    const directors = req.body.creators;
    if (!directors) {
      return next(new ApplicationError(ec.MOVIE_DIRECTORS_REQUIRED));
    }

    const movieid = "tt" + Math.floor(Math.random() * 1000000000);

    const image = req.file;
    if (!image) {
      return next(new ApplicationError(ec.MOVIE_IMAGE_REQUIRED));
    }

    const uploadResult = await uploadImage(image);

    const movie = {
      id: movieid,
      title: title,
      fulltitle: fulltitle,
      releasedate: releasedate,
      year: year,
      plot: plot,
      type: "Movie",
      imageurl: uploadResult,
      genres: genres,
      actors: actors,
      directors: directors,
    };

    await movieModel.add(movie);

    return res.json({
      ok: true,
    });
  } catch (e) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const addFav = async (req, res, next) => {
  try {
    const movieId = req.body.movieId;
    if (!movieId) {
      return next(new ApplicationError(ec.MOVIE_ID_REQUIRED));
    }

    const movie = await movieModel.one(movieId);
    if (!movie) {
      return next(new ApplicationError(ec.MOVIE_NOT_FOUND));
    }

    await movieModel.addFav({ movieid: movie.id });

    res.render("partials/success", {
      message: "Movie added to favorite list",
    });
  } catch (e) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const getAllFav = async (req, res, next) => {
  try {
    let favs = await movieModel.getAllFav();
    const movies = await movieModel.all();

    favs = await Promise.all(
      favs.map(async (m) => {
        m.genres = await getGenres(m.id);
        m.genres = processGenres(m.genres);
        return m;
      })
    );

    const moviesNotIncludeFav = movies.filter(
      (movie) => !favs.find((fav) => fav.id === movie.id)
    );

    moviesNotIncludeFav.sort((a, b) => a.fulltitle.localeCompare(b.fulltitle));
    res.render("home/fav", {
      favs: favs,
      movies: moviesNotIncludeFav,
    });
  } catch (err) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const deleteFav = async (req, res, next) => {
  try {
    const movieId = req.query.id;
    if (!movieId) {
      return next(new ApplicationError(ec.MOVIE_ID_REQUIRED));
    }

    await movieModel.deleteFav(movieId);

    res.render("partials/success", {
      message: "Movie removed from favorite list",
    });
  } catch (e) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const createReview = async (req, res, next) => {
  try {
    const username = req.body.username;
    if (!username) {
      return next(new ApplicationError(ec.USERNAME_REQUIRED));
    }

    const reviewtitle = req.body.reviewtitle;
    if (!reviewtitle) {
      return next(new ApplicationError(ec.REVIEW_TITLE_REQUIRED));
    }

    const reviewcontent = req.body.reviewcontent;
    if (!reviewcontent) {
      return next(new ApplicationError(ec.REVIEW_CONTENT_REQUIRED));
    }

    const review = {
      movieid: req.query.movieId,
      username: username,
      reviewtitle: reviewtitle,
      reviewcontent: reviewcontent,
      reviewdate: new Date().toISOString(),
    };

    await reviewModel.create(review);

    res.render("partials/success", {
      message: "Review successfully",
    });
  } catch (e) {
    return next(new ApplicationError(ec.SERVER_ERROR));
  }
};

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
  let res = "";
  genres.forEach((genre) => {
    res += genre.value + ", ";
  });
  res = res.slice(0, res.length - 2);
  return "[" + res + "]";
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

  return `imdb: ${ratings.imdb || "no data"}, metacritic: ${
    ratings.metacritic || "no data"
  }, rottenTomatoes: ${ratings.rottentomatoes || "no data"}, filmaffinity: ${
    ratings.filmaffinity || "no data"
  }`;
};

const processDirectors = async (directors) => {
  if (!directors || directors.length === 0) {
    return "";
  }

  return directors
    .map((director) => {
      return director.name;
    })
    .join(", ");
};

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
    actors.forEach(actor => {
      actor.charactername = actor.charactername || "No data";
    })

    const reviews = await reviewModel.getByMovieId(movie.id);
    reviews.forEach((review) => {
      review.reviewdate = review.reviewdate.toISOString().split("T")[0];
    });

    movie.awards = movie.awards || "No data";
    movie.companies = movie.companies || "No data";

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
  upload,
  addMovie,
  deleteFav,
  getAllFav,
  addFav,
  createReview,
  getTopBoxOffice,
  getTopRating,
  getTopFavorite,
  getByNameOrGenres,
  getById,
  getAddMoviePage,
};
