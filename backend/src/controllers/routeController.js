const axios = require("axios");

const getBestRoute = async (req, res) => {
  try {
    const { origin, destination } = req.body;

    // Validate input
    if (
      !origin ||
      !destination ||
      origin.lat == null ||
      origin.lng == null ||
      destination.lat == null ||
      destination.lng == null
    ) {
      return res.status(400).json({
        message: "Origin and destination coordinates are required",
      });
    }

    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng,
            },
          },
        },

        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },

        travelMode: "DRIVE",

        routingPreference: "TRAFFIC_AWARE_OPTIMAL",

        computeAlternativeRoutes: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
      }
    );

    const routes = response.data.routes || [];

    if (routes.length === 0) {
      return res.status(404).json({
        message: "No route found",
      });
    }

    // Convert Google response into cleaner data
    const formattedRoutes = routes.map((route, index) => ({
      routeNumber: index + 1,
      distanceKm: Number((route.distanceMeters / 1000).toFixed(2)),
      durationMinutes: Math.ceil(
        parseFloat(route.duration.replace("s", "")) / 60
      ),
      encodedPolyline: route.polyline?.encodedPolyline,
    }));

    // Google returns the recommended route first
    const bestRoute = formattedRoutes[0];

    return res.status(200).json({
      message: "Traffic-aware route calculated successfully",
      bestRoute,
      alternativeRoutes: formattedRoutes.slice(1),
    });
  } catch (error) {
    console.error(
      "Google Routes API Error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      message: "Failed to calculate route",
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

module.exports = {
  getBestRoute,
};