import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

function RideHistory() {

  const [rides, setRides] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/rides/my-rides",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRides(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const displayedRides = showAll
    ? rides
    : rides.filter(
        (ride) => ride.status === "accepted"
      );

  return (
    <div className="card">

      <h2>My Rides</h2>

      <br />

      <button
        className="primary-btn"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll
          ? "Show Ongoing Only"
          : "Show All Rides"}
      </button>

      <br />
      <br />

      {displayedRides.length === 0 ? (
        <p>No ongoing rides</p>
      ) : (
        displayedRides.map((ride) => (
          <div
            key={ride.id}
            className="ride-card"
          >

            <h4>
              {ride.pickup_location} → {ride.drop_location}
            </h4>

            <p>
              Status: {ride.status}
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default RideHistory;