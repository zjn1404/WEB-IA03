const router = require("express").Router();
const movieController = require("../controllers/movie.c");

router.get("/top-box-office", movieController.getTopBoxOffice);
router.get("/top-ratings", movieController.getTopRating);
router.get("/top-favorites", movieController.getTopFavorite);
router.get("/find", movieController.getByNameOrGenres)

module.exports = router;
