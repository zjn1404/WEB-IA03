const directorModel = require('../models/directordb.m.js');
const ApplicationError = require("../error/cerror.js");
const errorCode = require("../error/errorCode.js");

const ec = errorCode.ErrorCode;

const findByName = async (req, res, next) => {
  const limit = 9;
  try {
    const page = req.query.page || 1;
    let creators = await directorModel.getByName(req.query.keyword);
    const totalPages = Math.ceil(creators.length / limit);
    creators = creators.slice((page - 1) * limit, page * limit);
    console.log(creators);
    res.render("home/directorsearch", {
      directors: creators,
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
