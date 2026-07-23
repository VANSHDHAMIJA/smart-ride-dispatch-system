import { useEffect, useState } from "react";
import axios from "axios";
import CaptainTrips from "./CaptainTrips";
import "../Dashboard.css";

const API = import.meta.env.VITE_API_URL;

function CaptainDashboard() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchPendingRides();
  }, []);

  const fetchPendingRides = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/rides/pending`,
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

  const acceptRide = async (rideId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/api/rides/${rideId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ride Accepted Successfully");

      fetchPendingRides();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed To Accept Ride"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="hero">
        <div>
          <h1>🚖 SmartRide AI</h1>
          <p>Captain Control Panel</p>
          <h3>Welcome Captain 👋</h3>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h2>🚗</h2>
          <h3>{rides.length}</h3>
          <p>Pending Rides</p>
        </div>

        <div className="stat-card">
          <h2>✅</h2>
          <h3>42</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h2>💰</h2>
          <h3>₹18,250</h3>
          <p>Total Earnings</p>
        </div>

        <div className="stat-card">
          <h2>⭐</h2>
          <h3>4.9</h3>
          <p>Rating</p>
        </div>
      </div>

      {/* Pending Rides */}
      <div className="card">
        <h2>🚖 Ride Requests</h2>

        <p>
          AI has matched these rides based on captain availability and distance.
        </p>

        {rides.length === 0 ? (
          <div className="empty-state">
            <h2>🚗</h2>

            <h3>No Pending Rides</h3>

            <p>New ride requests will appear here.</p>
          </div>
        ) : (
          rides.map((ride) => (
            <div
              key={ride.id}
              className="ride-card"
            >
              <div className="ride-top">
                <div>
                  <h3>📍 {ride.pickup_location}</h3>

                  <p>↓</p>

                  <h3>🏁 {ride.drop_location}</h3>
                </div>

                <span className="status pending">
                  {ride.status}
                </span>
              </div>

              <div className="ride-bottom">
                <div>🤖 AI Dispatch Score : 96%</div>

                <div>Ride ID : {ride.id}</div>
              </div>

              <br />

              <button
                className="primary-btn"
                onClick={() => acceptRide(ride.id)}
              >
                ✅ Accept Ride
              </button>
            </div>
          ))
        )}
      </div>

      <CaptainTrips refreshKey={rides.length} />
    </div>
  );
}

export default CaptainDashboard;