import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

function CaptainTrips() {

  const [trips, setTrips] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/rides/my-trips",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTrips(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const startRide = async (rideId) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride Started");

      fetchTrips();

    } catch (error) {

      console.error(error);

      alert("Failed To Start Ride");

    }
  };

  const completeRide = async (rideId) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride Completed");

      fetchTrips();

    } catch (error) {

      console.error(error);

      alert("Failed To Complete Ride");

    }
  };

  const displayedTrips = showAll
    ? trips
    : trips.filter(
        (trip) =>
          trip.status === "accepted" ||
          trip.status === "ongoing"
      );

  return (
    <div className="card">

      <h2>My Trips</h2>

      <br />

      <button
        className="primary-btn"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll
          ? "Show Active Trips Only"
          : "Show All Trips"}
      </button>

      <br />
      <br />

      {displayedTrips.length === 0 ? (
        <p>No active trips</p>
      ) : (
        displayedTrips.map((trip) => (
          <div
            key={trip.id}
            className="ride-card"
          >

            <h4>
              {trip.pickup_location} → {trip.drop_location}
            </h4>

            <p>
              Status: {trip.status}
            </p>

            {trip.status === "accepted" && (
              <button
                className="primary-btn"
                onClick={() => startRide(trip.id)}
              >
                Start Ride
              </button>
            )}

            {trip.status === "ongoing" && (
              <button
                className="primary-btn"
                onClick={() => completeRide(trip.id)}
              >
                Complete Ride
              </button>
            )}

          </div>
        ))
      )}

    </div>
  );
}

export default CaptainTrips;