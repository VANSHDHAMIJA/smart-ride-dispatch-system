import { useEffect, useState } from "react";
import axios from "axios";
import CaptainTrips from "./CaptainTrips";
import "../Dashboard.css";
import { FaUserTie } from "react-icons/fa";

function CaptainDashboard() {

  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchPendingRides();
  }, []);

  const fetchPendingRides = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/rides/pending",
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

  const acceptRide = async (rideId) => {

    try {

      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride Accepted");

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

      <div className="navbar">

        <div className="nav-left">
          <h1>
            <FaUserTie /> Captain Dashboard
          </h1>
        </div>

        <div className="nav-right">
          <button onClick={logout}>
            Logout
          </button>
        </div>

      </div>

      <div className="card">

        <h2>Pending Rides</h2>

        <br />

        {rides.length === 0 ? (
          <p>No pending rides available</p>
        ) : (
          rides.map((ride) => (
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

              <br />

              <button
                className="primary-btn"
                onClick={() => acceptRide(ride.id)}
              >
                Accept Ride
              </button>

            </div>
          ))
        )}

      </div>

      <CaptainTrips />

    </div>
  );
}

export default CaptainDashboard;