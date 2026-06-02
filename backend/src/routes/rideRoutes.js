const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");
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
  authorizeRole("captain"),
  getPendingRides
);

router.patch(
  "/:id/accept",
  verifyToken,
  authorizeRole("captain"),
  acceptRide
);

router.patch(
  "/:id/start",
  verifyToken,
  authorizeRole("captain"),
  startRide
);

router.patch(
  "/:id/complete",
  verifyToken,
  authorizeRole("captain"),
  completeRide
);

module.exports = router;
