const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  bookRide,
  getPendingRides,
  acceptRide,
  startRide,
  completeRide
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

router.patch(
  "/:id/start",
  verifyToken,
  startRide
);

router.patch(
  "/:id/complete",
  verifyToken,
  completeRide
);

module.exports = router;
