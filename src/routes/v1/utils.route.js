const express = require("express");
const { utilsController } = require("../../controllers");

const router = express.Router();

router.route("/time").post(utilsController.currentTime);

module.exports = router;
