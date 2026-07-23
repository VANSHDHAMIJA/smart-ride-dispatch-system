import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

const API = import.meta.env.VITE_API_URL;

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
        `${API}/api/rides/my-rides`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRides(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const displayedRides = showAll
    ? rides
    : rides.filter((ride) => ride.status === "accepted");

  return (
    <div className="card">
      <div className="ride-header">
        <h2>🚖 My Ride History</h2>

        <button
          className="primary-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Active Ride" : "Show All Rides"}
        </button>
      </div>

      <br />

      {displayedRides.length === 0 ? (
        <div className="empty-state">
          <h2>🚗</h2>

          <h3>No Active Rides</h3>

          <p>Book your first ride to get started.</p>
        </div>
      ) : (
        displayedRides.map((ride) => (
          <div
            key={ride.id}
            className="ride-card"
          >
            <div className="ride-top">
              <div>
                <h3>📍 {ride.pickup_location}</h3>

                <p>➜</p>

                <h3>🏁 {ride.drop_location}</h3>
              </div>

              <span
                className={`status ${ride.status}`}
              >
                {ride.status}
              </span>
            </div>

            <div className="ride-bottom">
              <div>🚖 SmartRide AI Dispatch</div>

              <div>Ride ID : {ride.id}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RideHistory;