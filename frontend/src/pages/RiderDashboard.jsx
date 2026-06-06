import { useState } from "react";
import axios from "axios";
import RideHistory from "./RideHistory";
import "../Dashboard.css";
import { FaUser } from "react-icons/fa";

function RiderDashboard() {

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const bookRide = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/rides/book",
        {
          pickup_location: pickup,
          drop_location: drop
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride Booked Successfully");

      setPickup("");
      setDrop("");

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert("Failed To Book Ride");

    }
  };

  const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";

};

  return (
  <div>

      <div className="navbar">

  <div className="nav-left">
    <h1>
      <FaUser /> Rider Dashboard
    </h1>
  </div>

  <div className="nav-right">
    <button onClick={logout}>
      Logout
    </button>
  </div>

</div>

      <hr />

      <div className="card">

  <h2>Book a Ride</h2>

  <br />

  <div className="input-group">

    <input
      type="text"
      placeholder="Pickup Location"
      value={pickup}
      onChange={(e) => setPickup(e.target.value)}
    />

    <input
      type="text"
      placeholder="Drop Location"
      value={drop}
      onChange={(e) => setDrop(e.target.value)}
    />

    <button
      className="primary-btn"
      onClick={bookRide}
    >
      Book Ride
    </button>

  </div>

</div>

      <hr />

      <RideHistory />

    </div>
  );
}

export default RiderDashboard;