import { useState } from "react";
import axios from "axios";
import RideHistory from "./RideHistory";

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

  window.location.reload();

};

  return (
    <div>

      <h1>Rider Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Book Ride</h2>

      <input
        type="text"
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Drop Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
      />

      <br /><br />

      <button onClick={bookRide}>
        Book Ride
      </button>

      <hr />

      <RideHistory />

    </div>
  );
}

export default RiderDashboard;