const router = require("express").Router();
const actorController = require("../controllers/actor.c.js");

router.get("/search-actor", actorController.findByName);

module.exports = router;