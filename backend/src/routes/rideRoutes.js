const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  bookRide,
  getPendingRides,
  acceptRide
} = require("../controllers/rideController");

router.post(
  "/book",
  verifyToken,
  bookRide
);

router.get(
  "/pending",
  verifyToken,
  getPendingRides
);

router.patch(
  "/:id/accept",
  verifyToken,
  acceptRide
);

module.exports = router;