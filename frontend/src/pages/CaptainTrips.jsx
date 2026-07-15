import { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { decode } from "@googlemaps/polyline-codec";
import "../Dashboard.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  marginTop: "15px",
  borderRadius: "10px",
};

// Demo location coordinates
// Add more locations here when needed
const LOCATION_COORDINATES = {
  "VIT VELLORE": {
    lat: 12.9692,
    lng: 79.1559,
  },

  "VIT VELLORE, TAMIL NADU": {
    lat: 12.9692,
    lng: 79.1559,
  },

  "KATPADI RAILWAY STATION": {
    lat: 12.9723,
    lng: 79.1384,
  },

  "KATPADI JUNCTION RAILWAY STATION": {
    lat: 12.9723,
    lng: 79.1384,
  },

  "VELLORE FORT": {
    lat: 12.9202,
    lng: 79.1333,
  },

  "CMC VELLORE": {
    lat: 12.9249,
    lng: 79.1357,
  },
};

function CaptainTrips() {
  const [trips, setTrips] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Route states
  const [selectedTrip, setSelectedTrip] =
    useState(null);

  const [origin, setOrigin] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [routePath, setRoutePath] =
    useState([]);

  const [routeInfo, setRouteInfo] =
    useState(null);

  const [loadingRouteId, setLoadingRouteId] =
    useState(null);

  const [routeError, setRouteError] =
    useState("");

  // Ride action states
  const [startingRideId, setStartingRideId] =
    useState(null);

  const [
    completingRideId,
    setCompletingRideId,
  ] = useState(null);

  // Load Google Maps
  const {
    isLoaded,
    loadError,
  } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env
        .VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  // ==========================================
  // FETCH TRIPS
  // ==========================================

  const fetchTrips = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/rides/my-trips",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTrips(response.data);
    } catch (error) {
      console.error(
        "Fetch Trips Error:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ==========================================
  // START RIDE
  // ==========================================

  const startRide = async (rideId) => {
    try {
      setStartingRideId(rideId);

      const token =
        localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/start`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Ride Started");

      await fetchTrips();
    } catch (error) {
      console.error(
        "Start Ride Error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed To Start Ride"
      );
    } finally {
      setStartingRideId(null);
    }
  };

  // ==========================================
  // COMPLETE RIDE
  // ==========================================

  const completeRide = async (rideId) => {
    try {
      setCompletingRideId(rideId);

      const token =
        localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/complete`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert("Ride Completed");

      if (selectedTrip?.id === rideId) {
        clearRoute();
      }

      await fetchTrips();
    } catch (error) {
      console.error(
        "Complete Ride Error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed To Complete Ride"
      );
    } finally {
      setCompletingRideId(null);
    }
  };

  // ==========================================
  // GET COORDINATES
  // ==========================================

  const getCoordinates = (
    locationName
  ) => {
    if (!locationName) {
      return null;
    }

    const normalizedName =
      locationName
        .trim()
        .toUpperCase();

    return (
      LOCATION_COORDINATES[
        normalizedName
      ] || null
    );
  };

  // ==========================================
  // VIEW BEST ROUTE
  // ==========================================

  const viewBestRoute = async (trip) => {
    if (
      loadingRouteId === trip.id
    ) {
      return;
    }

    try {
      setLoadingRouteId(trip.id);

      setSelectedTrip(trip);
      setRouteError("");
      setRouteInfo(null);
      setRoutePath([]);
      setOrigin(null);
      setDestination(null);

      console.log(
        "Finding coordinates..."
      );

      // Get pickup coordinates
      const pickupCoordinates =
        getCoordinates(
          trip.pickup_location
        );

      // Get destination coordinates
      const dropCoordinates =
        getCoordinates(
          trip.drop_location
        );

      console.log(
        "Pickup:",
        pickupCoordinates
      );

      console.log(
        "Destination:",
        dropCoordinates
      );

      // Validate pickup
      if (!pickupCoordinates) {
        throw new Error(
          `Coordinates not available for pickup: ${trip.pickup_location}`
        );
      }

      // Validate destination
      if (!dropCoordinates) {
        throw new Error(
          `Coordinates not available for destination: ${trip.drop_location}`
        );
      }

      // Set map markers
      setOrigin(
        pickupCoordinates
      );

      setDestination(
        dropCoordinates
      );

      console.log(
        "Calling Routes API..."
      );

      // Call backend
      const response =
        await axios.post(
          "http://localhost:5000/api/routes/best-route",
          {
            origin:
              pickupCoordinates,

            destination:
              dropCoordinates,
          },
          {
            timeout: 20000,
          }
        );

      console.log(
        "Route Response:",
        response.data
      );

      const bestRoute =
        response.data?.bestRoute;

      if (!bestRoute) {
        throw new Error(
          "No route returned by backend"
        );
      }

      if (
        !bestRoute.encodedPolyline
      ) {
        throw new Error(
          "Route polyline missing"
        );
      }

      // Decode route
      const decodedPath =
        decode(
          bestRoute
            .encodedPolyline
        ).map(
          ([lat, lng]) => ({
            lat,
            lng,
          })
        );

      setRoutePath(
        decodedPath
      );

      // Set route information
      setRouteInfo({
        distanceKm:
          bestRoute.distanceKm,

        durationMinutes:
          bestRoute
            .durationMinutes,
      });
    } catch (error) {
      console.error(
        "Route Error:",
        error.response?.data ||
          error.message
      );

      let errorMessage =
        "Failed to calculate route";

      if (
        error.code ===
        "ECONNABORTED"
      ) {
        errorMessage =
          "Route API request timed out";
      } else if (
        error.response?.data
          ?.error
      ) {
        errorMessage =
          error.response.data.error;
      } else if (
        error.response?.data
          ?.message
      ) {
        errorMessage =
          error.response.data
            .message;
      } else if (
        error.message
      ) {
        errorMessage =
          error.message;
      }

      setRouteError(
        errorMessage
      );
    } finally {
      setLoadingRouteId(
        null
      );
    }
  };

  // ==========================================
  // CLEAR ROUTE
  // ==========================================

  const clearRoute = () => {
    setSelectedTrip(null);
    setOrigin(null);
    setDestination(null);
    setRoutePath([]);
    setRouteInfo(null);
    setRouteError("");
    setLoadingRouteId(null);
  };

  // ==========================================
  // FILTER TRIPS
  // ==========================================

  const displayedTrips =
    showAll
      ? trips
      : trips.filter(
          (trip) =>
            trip.status ===
              "accepted" ||
            trip.status ===
              "ongoing"
        );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="card">

      <h2>My Trips</h2>

      <br />

      <button
        className="primary-btn"
        onClick={() =>
          setShowAll(!showAll)
        }
      >
        {showAll
          ? "Show Active Trips Only"
          : "Show All Trips"}
      </button>

      <br />
      <br />

      {displayedTrips.length ===
      0 ? (
        <p>No active trips</p>
      ) : (
        displayedTrips.map(
          (trip) => (
            <div
              key={trip.id}
              className="ride-card"
            >

              <h4>
                {
                  trip.pickup_location
                }
                {" → "}
                {
                  trip.drop_location
                }
              </h4>

              <p>
                Status:{" "}
                <strong>
                  {trip.status}
                </strong>
              </p>

              {/* VIEW ROUTE */}

              {(trip.status ===
                "accepted" ||
                trip.status ===
                  "ongoing") && (

                <button
                  className="primary-btn"

                  onClick={() =>
                    viewBestRoute(
                      trip
                    )
                  }

                  disabled={
                    loadingRouteId ===
                    trip.id
                  }
                >

                  {loadingRouteId ===
                  trip.id
                    ? "Finding Best Route..."
                    : "View Best Route"}

                </button>
              )}

              {" "}

              {/* START RIDE */}

              {trip.status ===
                "accepted" && (

                <button
                  className="primary-btn"

                  onClick={() =>
                    startRide(
                      trip.id
                    )
                  }

                  disabled={
                    startingRideId ===
                    trip.id
                  }
                >

                  {startingRideId ===
                  trip.id
                    ? "Starting..."
                    : "Start Ride"}

                </button>
              )}

              {" "}

              {/* COMPLETE RIDE */}

              {trip.status ===
                "ongoing" && (

                <button
                  className="primary-btn"

                  onClick={() =>
                    completeRide(
                      trip.id
                    )
                  }

                  disabled={
                    completingRideId ===
                    trip.id
                  }
                >

                  {completingRideId ===
                  trip.id
                    ? "Completing..."
                    : "Complete Ride"}

                </button>
              )}

            </div>
          )
        )
      )}

      {/* ROUTE ERROR */}

      {routeError && (

        <div className="ride-card">

          <h3>
            Route Error
          </h3>

          <p>
            {routeError}
          </p>

          <button
            className="primary-btn"
            onClick={clearRoute}
          >
            Close
          </button>

        </div>
      )}

      {/* MAP */}

      {selectedTrip &&
        origin &&
        destination && (

        <div className="ride-card">

          <h3>
            Traffic-Aware Best Route
          </h3>

          <p>
            <strong>
              Pickup:
            </strong>{" "}
            {
              selectedTrip
                .pickup_location
            }
          </p>

          <p>
            <strong>
              Destination:
            </strong>{" "}
            {
              selectedTrip
                .drop_location
            }
          </p>

          {routeInfo && (
            <>

              <p>
                <strong>
                  Distance:
                </strong>{" "}
                {
                  routeInfo
                    .distanceKm
                }{" "}
                km
              </p>

              <p>
                <strong>
                  Traffic-Aware ETA:
                </strong>{" "}
                {
                  routeInfo
                    .durationMinutes
                }{" "}
                minutes
              </p>

            </>
          )}

          {/* Map failure must not break ride buttons */}

          {loadError ? (

            <p>
              Google Map failed
              to load.
            </p>

          ) : !isLoaded ? (

            <p>
              Loading map...
            </p>

          ) : (

            <GoogleMap
              mapContainerStyle={
                mapContainerStyle
              }

              center={
                origin
              }

              zoom={14}
            >

              <MarkerF
                position={
                  origin
                }

                label="P"

                title="Pickup"
              />

              <MarkerF
                position={
                  destination
                }

                label="D"

                title="Destination"
              />

              {routePath.length >
                0 && (

                <PolylineF
                  path={
                    routePath
                  }

                  options={{
                    strokeOpacity:
                      1,

                    strokeWeight:
                      5,
                  }}
                />

              )}

            </GoogleMap>

          )}

          <br />

          <button
            className="primary-btn"

            onClick={
              clearRoute
            }
          >
            Close Route
          </button>

        </div>

      )}

    </div>
  );
}

export default CaptainTrips;