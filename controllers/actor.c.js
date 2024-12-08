const actorModel = require("../models/actordb.m.js");
const movieModel = require("../models/moviedb.m.js");
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");

const ec = errorCode.ErrorCode;

const processDate = (date) => {
  if (date === null || date === undefined) {
    return "unknown";
  }
  return date.toISOString().split("T")[0];
};

const processGenres = (genres) => {
  if (genres.length === 0) {
    return "";
  }
  return "[" + genres.join(",") + "]";
};

const findById = async (req, res, next) => {
  try {
    const actor = await actorModel.one(req.query.id);
    if (actor.length === 0) {
      return next(new ApplicationError(ec.ACTOR_NOT_FOUND));
    }
    actor[0].birthdate = processDate(actor[0].birthdate);
    actor[0].deathdate = processDate(actor[0].deathdate);

    const movies = await movieModel.getByActorId(actor[0].id);

    res.render("home/actordetail", {
      actor: actor[0],
      movies: movies,
    });
  } catch (err) {
    next(new ApplicationError(ec.SERVER_ERROR));
  }
};

const findByName = async (req, res, next) => {
  const limit = 9;
  try {
    const page = req.query.page || 1;

    let actors = await actorModel.getByName(req.query.keyword);
    const totalPages = Math.ceil(actors.length / limit);
    actors = actors.slice((page - 1) * limit, page * limit);

    res.render("home/actorsearch", {
      actors: actors,
      page: page,
      totalPages: totalPages,
    });
  } catch (err) {
    next(new ApplicationError(ec.SERVER_ERROR));
  }
};

module.exports = {
  findByName,
  findById,
};
