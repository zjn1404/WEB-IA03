const router = require("express").Router();
const actorController = require("../controllers/actor.c.js");

router.get("/search-actor", actorController.findByName);
router.get("/actor", actorController.findById)

module.exports = router;