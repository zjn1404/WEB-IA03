const router = require("express").Router();
const movieController = require("../controllers/movie.c");

router.get("/movie/add", movieController.getAddMoviePage);
router.post("/movie",movieController.upload.single('image'), movieController.addMovie);
router.get("/top-box-office", movieController.getTopBoxOffice);
router.get("/top-ratings", movieController.getTopRating);
router.get("/top-favorites", movieController.getTopFavorite);
router.get("/search-movie", movieController.getByNameOrGenres);
router.get("/movie", movieController.getById);
router.post("/review", movieController.createReview);
router.post("/fav", movieController.addFav);
router.get("/fav", movieController.getAllFav);
router.get("/fav/delete", movieController.deleteFav);

module.exports = router;
