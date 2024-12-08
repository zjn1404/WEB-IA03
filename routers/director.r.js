const router = require("express").Router();
const directorController = require("../controllers/director.c.js");

router.get("/search-director", directorController.findByName);

module.exports = router;