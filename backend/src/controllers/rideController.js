const pool = require("../config/db");

const bookRide = async (req, res) => {
  try {

    const { pickup_location, drop_location } = req.body;

    const rider_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO rides
      (rider_id, pickup_location, drop_location)
      VALUES($1,$2,$3)
      RETURNING *`,
      [rider_id, pickup_location, drop_location]
    );

    res.status(201).json({
      message: "Ride booked successfully",
      ride: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

const getPendingRides = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM rides WHERE status = 'pending'"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

const acceptRide = async (req, res) => {
  try {

    const rideId = req.params.id;
    const captainId = req.user.id;

    const result = await pool.query(
      `UPDATE rides
       SET captain_id = $1,
           status = 'accepted'
       WHERE id = $2
       RETURNING *`,
      [captainId, rideId]
    );

    res.json({
      message: "Ride accepted successfully",
      ride: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

const startRide = async (req, res) => {
  try {

    const rideId = req.params.id;

    const result = await pool.query(
      `UPDATE rides
       SET status = 'ongoing'
       WHERE id = $1
       RETURNING *`,
      [rideId]
    );

    res.json({
      message: "Ride started",
      ride: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

const completeRide = async (req, res) => {
  try {

    const rideId = req.params.id;

    const result = await pool.query(
      `UPDATE rides
       SET status = 'completed'
       WHERE id = $1
       RETURNING *`,
      [rideId]
    );

    res.json({
      message: "Ride completed",
      ride: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

module.exports = {
  bookRide,
  getPendingRides,
  acceptRide,
  startRide,
  completeRide
};