import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationSelector = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const DynamicMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const AddressField = ({handleChange,formData,errors,setFormData}) => {
  // const [formData, setFormData] = useState({ address: "" });
 
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.076, 72.8777]); // Default to Mumbai

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Failed to get user location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  

  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      setMapLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { Accept: "application/json" } }
      );
      const data = await response.json();
      const address = data?.display_name || "Address not found. Try again.";
      setFormData({ ...formData, address });
      // setErrors({});
    } catch (error) {
      console.error("Fetch error:", error);
      // setErrors({ address: "Failed to fetch address. Try again later." });
    } finally {
      setMapLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      // setErrors({ address: "Geolocation is not supported by your browser." });
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        await fetchAddressFromCoords(latitude, longitude);
        setLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED)
          errorMessage = "Permission denied. Please allow location access.";
        else if (error.code === error.TIMEOUT)
          errorMessage = "Location request timed out. Try again.";
        else if (error.code === error.POSITION_UNAVAILABLE)
          errorMessage = "Location information is unavailable.";

        // setErrors({ address: errorMessage });
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapClick = async (latlng) => {
    setSelectedPosition(latlng);
    await fetchAddressFromCoords(latlng.lat, latlng.lng);
    setOpenMap(false);
  };

  return (
    <div className="flex gap-4 items-start flex-wrap">
      <TextField
        id="outlined-basic"
        label="Address"
        variant="outlined"
        fullWidth
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={!!errors.address}
        helperText={errors.address}
      />

      <div className="flex gap-2">
      <Button
        variant="contained"
        onClick={handleUseCurrentLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? <CircularProgress size={24} /> : "Use Current Location"}
      </Button>
      <Button variant="outlined" onClick={() => setOpenMap(true)}>
        Select on Map
      </Button>
      </div>

      <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Location on Map</DialogTitle>
        <DialogContent style={{ height: "500px" }}>
          {mapLoading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <DynamicMapCenter center={mapCenter} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              />
              <LocationSelector onSelect={handleMapClick} />
              {selectedPosition && <Marker position={selectedPosition} />} 
            </MapContainer>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressField;
