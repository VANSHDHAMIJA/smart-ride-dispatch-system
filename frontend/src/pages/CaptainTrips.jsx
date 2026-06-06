import { useEffect, useState } from "react";
import axios from "axios";

function CaptainTrips() {

  const [trips, setTrips] = useState([]);

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

  return (
    <div>

      <h2>My Trips</h2>

      {trips.map((trip) => (
        <div key={trip.id}>

          <p>
            {trip.pickup_location} → {trip.drop_location}
          </p>

          <p>
            Status: {trip.status}
          </p>

          {trip.status === "accepted" && (
            <button
              onClick={() => startRide(trip.id)}
            >
              Start Ride
            </button>
          )}

          {trip.status === "ongoing" && (
            <button
              onClick={() => completeRide(trip.id)}
            >
              Complete Ride
            </button>
          )}

          <hr />

        </div>
      ))}

    </div>
  );
}

export default CaptainTrips;