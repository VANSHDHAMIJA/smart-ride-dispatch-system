import { useEffect, useState } from "react";
import axios from "axios";

function RideHistory() {

  const [rides, setRides] = useState([]);

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

  return (
    <div>

      <h2>My Rides</h2>

      {rides.map((ride) => (
        <div key={ride.id}>
          <p>
            {ride.pickup_location} → {ride.drop_location}
          </p>

          <p>Status: {ride.status}</p>

          <hr />
        </div>
      ))}

    </div>
  );
}

export default RideHistory;