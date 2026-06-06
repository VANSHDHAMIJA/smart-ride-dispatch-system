import { useEffect, useState } from "react";
import axios from "axios";
import CaptainTrips from "./CaptainTrips";
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

  window.location.reload();

};

  return (
    <div>

      <h1>Captain Dashboard</h1>
      <button onClick={logout}>
  Logout
</button>
      <h2>Pending Rides</h2>

      {rides.map((ride) => (
  <div key={ride.id}>

    <p>
      {ride.pickup_location} → {ride.drop_location}
    </p>

    <p>
      Status: {ride.status}
    </p>

    <button
      onClick={() => acceptRide(ride.id)}
    >
      Accept Ride
    </button>

    <hr />

  </div>
))}

<hr />

<CaptainTrips />

    </div>
  );
}

export default CaptainDashboard;