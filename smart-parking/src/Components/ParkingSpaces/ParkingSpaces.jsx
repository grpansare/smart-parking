import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import SearchBox from "../Hero/SearchBox";
import styles from "./ParkingSpaces.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { ParkingModal } from "../ParkingModal/ParkingModal";
import { Alert, Button, Snackbar } from "@mui/material";
import { ConfirmBookingModal } from "../ParkingModal/ConfirmBookingModal";
import { useSelector } from "react-redux";
import { cancelBooking } from "../../Utils/BookingFunctions";
import { getNearByParkingSpaces } from "../../Utils/ParkingSpaces";
import AllParkingSpots from "../AllParkingSpots/AllParkingSpots";

import { AlertCircle } from "lucide-react";

const ParkingSpaces = () => {
  const { searchedPlace } = useParams();
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]); // Pune coords

  const [loading, setLoading] = useState(false);

  const [geoLocations, setGeoLocations] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedSlot, setSelectedSlot] = useState();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
 
  const navigate = useNavigate();
  const handleMarkerClick = (spot) => {
    console.log("Clicked Spot:", spot);
    setSelectedSpot(spot);
    setShowModal(true);
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

  useEffect(() => {
    if (searchedPlace) {
      getParkingSpaces();
    }
  }, [searchedPlace]);

  useEffect(() => {
    if (parkingSpaces.length > 0 && searchedPlace) {
      fetchGeoLocations();
    }
  }, [parkingSpaces]);
  const confirmBooking = async (selected, slotNumber = null) => {
    if (!selected || !selected.spaceId) {
      console.log("No spot selected or invalid spot");
      return;
    }

    let token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8081/parkingspaces/bookparking`,
        { spaceId: selected.spaceId },
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

      const order = response.data;
      const options = {
        key: "rzp_test_5wU1xQg8xAioM6",
        amount: order.amount,
        currency: order.currency,
        name: "ParkEase",
        description: "Payment for order",
        order_id: order.id,
        handler: async function (response) {
          if (bookingConfirmed) return;
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
            lotName: selectedSpot.lotName,

            status: "SUCCESS",
          };

          try {
            await axios.post(
              "http://localhost:8081/api/payment/store",
              paymentDetails,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const response = await axios.post(
              `http://localhost:8081/api/bookings/${selectedSlot}`,
              bookingData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            console.log(response);

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
  const getParkingSpaces = async () => {
     setLoading(true)

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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
    }
    finally {
      setLoading(false); // end loading
    }
  
  };

  const fetchGeoLocations = async () => {
    // setLoading(true); 
    const locations = await Promise.all(
      parkingSpaces.map(async (space) => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: { q: space.address, format: "json", limit: 1 },
            }
          );

          if (response.data.length > 0) {
            return {
              lotName: space.lotName,
              spaceId: space.id,
              address: space.address,
              latitude: parseFloat(response.data[0].lat),
              longitude: parseFloat(response.data[0].lon),
              numberOfFloors: space.numberOfFloors, // Add floors
              parkingSlot: space.parkingSlot || [], // Add slots
              totalSlots: space.totalSlots,
              pricingPerHour: space.pricingPerHour,
            };
          }
        } catch (error) {
          console.error("Error geocoding address:", error);
        }
        return null;
      })
    );

    const validLocations = locations.filter((loc) => loc !== null);
    setGeoLocations(validLocations);

    if (validLocations.length > 0) {
      setMapCenter([validLocations[0].latitude, validLocations[0].longitude]);
    }
  };

  return (
    <div className={styles["main-container"]}>
      <SearchBox searchPlace={searchedPlace} />

      <>
      {loading ? (
  <div className="flex justify-center items-center h-96">
    <div className="text-blue-600 font-semibold text-xl animate-pulse">
      Loading parking spots...
    </div>
  </div>
) : (

  ( parkingSpaces.length >0 ?
(
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
):(
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="text-red-500 w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">No Parking Available</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but there are currently no parking spaces available in this area.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
          
          {showDetails && (
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="font-medium text-gray-700 mb-2">Why is parking unavailable?</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>All spaces are currently occupied</li>
                <li>Peak hours are between 9am-5pm</li>
                <li>Next available spot estimated in 30 minutes</li>
              </ul>
            </div>
          )}
          
          <div className="flex space-x-3 justify-center mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors">
              Try Another Location
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm">
        <p>Last updated: Just now</p>
      </div>
    </div>
)
)
)
}
        {/* <div className={styles["parkingspaces"]}>
          <h1 className="text-center text-3xl text-blue-950 font-mono">
            Parking Spaces
          </h1>
          <div className="flex flex-wrap w-100 border">
            {parkingSpaces.map((spot) => (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <img
                  src={"/parkingspace.jpeg"} // <- Ensure it's served correctly
                  alt={spot.lotName}
                  className="w-full h-48 object-fill"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{spot.lotName}</h3>
                  <p className="text-gray-600">{spot.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
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
    </div>
  );
};

export default ParkingSpaces;
