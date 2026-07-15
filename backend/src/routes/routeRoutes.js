const express = require("express");
const router = express.Router();

const {
  getBestRoute,
} = require("../controllers/routeController");

router.post("/best-route", getBestRoute);

module.exports = router;