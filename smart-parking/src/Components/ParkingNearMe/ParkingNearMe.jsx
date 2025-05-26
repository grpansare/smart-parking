import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../ParkingSpaces/ParkingSpaces.module.css";
import SearchBox from "../Hero/SearchBox";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Cookies from "js-cookie";

import { ParkingModal } from "../ParkingModal/ParkingModal";
import { Alert, Button, Snackbar } from "@mui/material";
import { ConfirmBookingModal } from "../ParkingModal/ConfirmBookingModal";

import { cancelBooking } from "../../Utils/BookingFunctions";
import axios from "axios";

const ParkingNearMe = () => {
  const { currentLocation } = useSelector((state) => state.user);
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]); // Pune coords

  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [geoLocations, setGeoLocations] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedSlot, setSelectedSlot] = useState();
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const handleMarkerClick = (spot) => {
    console.log("Clicked Spot:", spot);
    setSelectedSpot(spot);
    setShowModal(true);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    // setSelectedSpot(null);
  };
  const handleCloseConfirmModal = () => {
    setConfirmationModal(false);
    setSelectedSpot(null);
  };
  const handleChooseSlot = (space) => {
    handleMarkerClick(space);
  };

  const handleChooseRandom = async (space) => {
    setSelectedSpot(space);
    await confirmBooking(space); // Ensuring confirmBooking runs after state update
  };
  const getParkingSpaces = async () => {
    setLoading(true);

    let token = Cookies.get("jwt") || localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8081/parkingspaces/${searchedPlace}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response?.data[5].totalSlots);

      setParkingSpaces(response.data);
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    } finally {
      setLoading(false); // end loading
    }
  };

  useEffect(() => {
    if (currentLocation) {
      getNearSpaces();
    }
  }, [currentLocation]);

  const getNearSpaces = () => {
    axios
      .get(
        `http://localhost:8081/parkingspaces/nearby?lat=${currentLocation.lat}&lon=${currentLocation.lon}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setGeoLocations(response.data);
        setParkingSpaces(response.data);
        if (response.data.length > 0) {
          console.log(currentLocation);

          setMapCenter([currentLocation.lat, currentLocation.lon]);
        }
      })
      .catch((error) => console.error("Error fetching parking spots:", error));
  };

  const confirmBooking = async (selected, slotNumber = null) => {
    console.log(selected);

    if (!selected || !selected.spaceIdd) {
      console.log("No spot selected or invalid spot");
      return;
    }

    let token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8081/parkingspaces/bookparking`,
        { spaceId: selected.spaceIdd },
        {
          params: slotNumber ? { slotNumber } : {},
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.data) {
        console.log("Booking successful, opening confirmation modal...");
        setSelectedSlot(response.data);
        setConfirmationModal(true);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error booking parking:", error);
      alert("Booking failed. Try again.");
    }
  };

  const startPayment = async (paymentData, bookingData) => {
    console.log("Starting payment process");
    let token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      console.log("Sending request to create order");
      const response = await axios.post(
        "http://localhost:8081/api/payment/create-order",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(currentUser.email);

      const order = response.data;
      const options = {
        key: "rzp_test_5wU1xQg8xAioM6",
        amount: order.amount,
        currency: order.currency,
        name: "ParkEase",
        description: "Payment for order",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment Success:", response);

          // Prepare data to send to backend
          const paymentDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: order.amount / 100, // Convert from paise to INR
            currency: order.currency,
            customerEmail: currentUser.email,
            customerName: currentUser.fullname,
            lotName:selectedSpot.lotName,
            status: "SUCCESS",
          };

          try {
            // Send payment details to backend
            await axios.post(
              "http://localhost:8081/api/payment/store",
              paymentDetails,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // Store booking details
            const response = await axios.post(
              `http://localhost:8081/api/bookings/${selectedSlot}`,
              bookingData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            console.log(response);

            handleClick();
            navigate(`/dashboard/reciept/${response.data.id}`);
            getParkingSpaces();

            setConfirmationModal(false);
          } catch (error) {
            console.error("Error storing payment or booking details:", error);
            alert("Payment succeeded but failed to store booking details.");
          }
        },
        modal: {
          ondismiss: function () {
            cancelBooking(selectedSlot, selectedSpot);
            setSelectedSlot(null);
            setConfirmationModal(false);
            getParkingSpaces();
          },
        },
        prefill: {
          name: "Your Name",
          email: "youremail@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "note value",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  const DynamicMapCenter = ({ center }) => {
    const map = useMap();

    useEffect(() => {
      if (
        center &&
        Array.isArray(center) &&
        center.length === 2 &&
        typeof center[0] === "number" &&
        typeof center[1] === "number"
      ) {
        map.setView(center, 13);
      }
    }, [center, map]);

    return null;
  };

  const getMarkerIcon = (totalSlots) => {
    return new L.Icon({
      iconUrl: totalSlots > 0 ? "/green-marker.png" : "/red-marker.png",
      iconSize: [30, 30],
    });
  };

  const getSelectedMarkerIcon = () => {
    return new L.Icon({
      iconUrl: "/blue-marker.png", // Highlighted marker
      iconSize: [35, 35],
    });
  };

  return (
    <div className={styles["main-container"]}>
      <SearchBox />

      <>
        <div className={styles["map-div"]}>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <DynamicMapCenter center={mapCenter} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            {currentLocation && (
              <Marker position={[currentLocation.lat, currentLocation.lon]}>
                <Popup>You are here</Popup>
              </Marker>
            )}

            {geoLocations.map((space, index) => (
              <Marker key={index} position={[space.latitude, space.longitude]}>
                <Popup>
                  <div>
                    <strong>{space.lotName}</strong>
                    <br />
                    {space.address}
                    <br />
                    <div className="flex ">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleChooseSlot(space)}
                      >
                        Choose Slot
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleChooseRandom(space)}
                        style={{ marginLeft: "5px" }}
                      >
                        Choose Randomly
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className={styles["parkingspaces"]}>
          <h1 className="text-center text-3xl text-blue-950 font-mono">
            Parking Spaces
          </h1>

          <div className="flex flex-wrap gap-6 justify-center">
            {parkingSpaces.map((spot, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
                  <img
                    src={spot.image || "/parkingspace.jpeg"} // <- Ensure it's served correctly
                    alt={spot.lotName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{spot.lotName}</h3>
                    <p className="text-gray-600">{spot.address}</p>
                    <div className="mt-3 flex flex-col gap-2">
                      <a
                        href={spot.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Map
                      </a>
                      <button
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                        onClick={() => console.log("Booking", spot.lotName)} // Replace with real booking logic
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>

      <ParkingModal
        spot={selectedSpot}
        open={showModal}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        onBook={(slotNumber) => confirmBooking(selectedSpot, slotNumber)}
      />
      {selectedSlot && (
        <ConfirmBookingModal
          spot={selectedSpot}
          open={showConfirmationModal}
          onClose={handleCloseConfirmModal}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          startPayment={startPayment}
        />
      )}

      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Slot booked successfully !!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ParkingNearMe;
