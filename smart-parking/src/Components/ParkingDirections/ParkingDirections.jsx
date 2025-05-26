import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Box, Button, Modal } from "@mui/material";

const ParkingDirections = ({ PARKING_ADDRESS, open, onClose }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [parkingLocation, setParkingLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null); // Store estimated time

  useEffect(() => {
    // Convert Parking Address to Lat/Lng
    const fetchParkingCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            PARKING_ADDRESS
          )}`
        );
        if (response.data.length > 0) {
          setParkingLocation({
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon),
          });
        } else {
          console.error("No location found for the address");
        }
      } catch (error) {
        console.error("Error fetching parking coordinates:", error);
      }
    };

    fetchParkingCoordinates();
  }, [PARKING_ADDRESS]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location fetched:", position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(`Location error: ${error.message}`);
        },
        {
          enableHighAccuracy: true, // Forces GPS accuracy
          timeout: 10000, // Wait up to 10 seconds
          maximumAge: 0, // No cached location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (userLocation && parkingLocation) {
      fetchRoute();
    }
  }, [userLocation, parkingLocation]);

  const fetchRoute = async () => {
    console.log( [userLocation.lng, userLocation.lat], // Start (User's location)
      [parkingLocation.lng, parkingLocation.lat]);
    
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
        {
          coordinates: [
            [userLocation.lng, userLocation.lat], // Start (User's location)
            [parkingLocation.lng, parkingLocation.lat], // End (Parking location)
          ],
        },
        {
          headers: {
            Authorization: `5b3ce3597851110001cf62485009d6189dfe4865b7a422b0ab77ba50`, // ORS API Key
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.features.length > 0) {
        const routeData = response.data.features[0].geometry.coordinates;
        const decodedCoordinates = routeData.map(([lng, lat]) => ({
          lat,
          lng,
        }));

        setRoute(decodedCoordinates);

        // Get Estimated Time (ETA)
        const durationInSeconds =
          response.data.features[0].properties.segments[0].duration;
        setEta(Math.round(durationInSeconds / 60)); // Convert to minutes
      } else {
        console.error("No route found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 650,
          maxHeight: "80vh",
          p: 4,
          bgcolor: "background.paper",
          margin: "auto",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <h1 className="text-center text-emerald-950 font-mono text-xl mb-2">
          Directions to Parking
        </h1>
        <div>
          {userLocation && parkingLocation ? (
            <MapContainer
              center={userLocation || [20.5937, 78.9629]} // Default to India if location is not available
              zoom={14}
              style={{ height: "400px", width: "100%" }}
              key={
                userLocation
                  ? `${userLocation.lat}-${userLocation.lng}`
                  : "default"
              } // Force re-render
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User's Location Marker with Popup */}
              <Marker position={userLocation}>
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>

              {/* Parking Location Marker with Popup */}
              <Marker position={parkingLocation}>
                <Popup>
                  <strong>Parking Location</strong>
                  {eta && <p>Estimated Time: {eta} mins</p>}
                </Popup>
              </Marker>

              {/* Route Polyline */}
              {route.length > 0 && <Polyline positions={route} color="blue" />}
            </MapContainer>
          ) : (
            <p>Fetching location...</p>
          )}
        </div>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ParkingDirections;
