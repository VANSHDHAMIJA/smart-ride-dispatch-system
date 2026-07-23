import { useState } from "react";
import axios from "axios";
import RideHistory from "./RideHistory";
import "../Dashboard.css";

const API = import.meta.env.VITE_API_URL;

function RiderDashboard() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const bookRide = async () => {
    if (!pickup || !drop) {
      alert("Please select both Pickup and Destination.");
      return;
    }

    if (pickup === drop) {
      alert("Pickup and Destination cannot be the same.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/rides/book`,
        {
          pickup_location: pickup,
          drop_location: drop,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Ride Booked Successfully");

      setPickup("");
      setDrop("");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed To Book Ride"
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
      {/* HERO */}
      <div className="hero">
        <div>
          <h1>🚖 SmartRide AI</h1>
          <p>AI-Assisted Smart Ride Dispatch System</p>
          <h3>Welcome Back 👋</h3>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h2>🚗</h2>
          <h3>24</h3>
          <p>Total Rides</p>
        </div>

        <div className="stat-card">
          <h2>⭐</h2>
          <h3>20</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h2>💰</h2>
          <h3>₹5200</h3>
          <p>Total Fare</p>
        </div>

        <div className="stat-card">
          <h2>📍</h2>
          <h3>1</h3>
          <p>Active Ride</p>
        </div>
      </div>

      {/* AI RECOMMENDATION */}
      <div className="card">
        <h2>🤖 AI Ride Recommendation</h2>

        <p>
          SmartRide AI selects the most suitable captain based on
          distance, traffic conditions, and availability.
        </p>

        <div className="stats">
          <div className="stat-card">
            <h2>🚖</h2>
            <h3>Captain A12</h3>
            <p>Nearest Captain</p>
          </div>

          <div className="stat-card">
            <h2>📍</h2>
            <h3>1.8 km</h3>
            <p>Distance Away</p>
          </div>

          <div className="stat-card">
            <h2>⏱</h2>
            <h3>6 min</h3>
            <p>Estimated Arrival</p>
          </div>

          <div className="stat-card">
            <h2>🧠</h2>
            <h3>96%</h3>
            <p>AI Confidence</p>
          </div>
        </div>
      </div>

      {/* BOOK RIDE */}
      <div className="card">
        <h2>🚖 Book Your Ride</h2>

        <p>
          Choose pickup and destination to let SmartRide AI assign the
          best available captain.
        </p>

        <div className="input-group">
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          >
            <option value="">📍 Select Pickup</option>
            <option>India Gate</option>
            <option>Red Fort</option>
            <option>Connaught Place</option>
            <option>New Delhi Railway Station</option>
            <option>AIIMS Delhi</option>
            <option>Lotus Temple</option>
            <option>Qutub Minar</option>
            <option>Akshardham Temple</option>
            <option>Rajiv Chowk Metro Station</option>
            <option>Delhi Airport Terminal 3</option>
          </select>

          <select
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          >
            <option value="">🏁 Select Destination</option>
            <option>India Gate</option>
            <option>Red Fort</option>
            <option>Connaught Place</option>
            <option>New Delhi Railway Station</option>
            <option>AIIMS Delhi</option>
            <option>Lotus Temple</option>
            <option>Qutub Minar</option>
            <option>Akshardham Temple</option>
            <option>Rajiv Chowk Metro Station</option>
            <option>Delhi Airport Terminal 3</option>
          </select>

          <button
            className="primary-btn"
            onClick={bookRide}
          >
            🚖 Book Ride
          </button>
        </div>
      </div>

      {/* RIDE HISTORY */}
      <RideHistory />
    </div>
  );
}

export default RiderDashboard;