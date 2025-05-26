import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Box, Button, Modal } from "@mui/material";

const ViewOnMapModal = ({ parking_spot, open, onClose }) => {

  const [parkingLocation, setParkingLocation] = useState(null);
//   console.log("Geocoding address:", PARKING_ADDRESS);



  useEffect(() => {
    // Convert Parking Address to Lat/Lng
    const fetchParkingCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parking_spot.address)}`
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
  }, [parking_spot]);


  
  



 

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

        <h1 className="text-center text-emerald-950 font-mono text-xl mb-2">{parking_spot.lotName}</h1>
        <div>
          { parkingLocation ? (
          <MapContainer 
          center={parkingLocation || [20.5937, 78.9629]} // Default to India if location is not available
          zoom={14}
          style={{ height: "400px", width: "100%" }}
        //   key={parkingLocation ? `${parkingLocation.lat}-${parkingLocation.lng}` : "default"} // Force re-render
        >
        
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* User's Location Marker with Popup */}
              

              {/* Parking Location Marker with Popup */}
              <Marker position={parkingLocation}>
                <Popup>
                  <strong>Parking Location</strong>
                 
                </Popup>
              </Marker>

           
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

export default ViewOnMapModal;