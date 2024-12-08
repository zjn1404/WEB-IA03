const actorModel = require("../models/actordb.m.js");
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");

const ec = errorCode.ErrorCode;

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
};
