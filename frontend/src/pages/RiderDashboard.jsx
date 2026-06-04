import { useState } from "react";
import axios from "axios";

function RiderDashboard() {

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const bookRide = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.post(
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

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed To Book Ride");

    }
  };

  return (
    <div>

      <h2>Rider Dashboard</h2>

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

    </div>
  );
}

export default RiderDashboard;