import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6'; // Added missing import
import Navbar from '../Navbar/Navbar';
import Cookies from "js-cookie";
import ViewOnMapModal from '../ViewOnMapModal/ViewOnMapModal';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BookSlotModal } from '../BookSlotModal/BookSlotModal';

import { ConfirmBookingModal } from '../ParkingModal/ConfirmBookingModal';

const AllParkingSpots = () => {
  const [allSpots, setAllSpots] = useState([]);
  const [loading, setLoading] = useState(true); // for loader

  const [searchplace, setSearchPlace] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [parkingSpot, setparkingSpot] = useState();
  const [showModal, setShowModal] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [bookingMode, setBookingMode] = useState('manual'); // Default to manual selection
  const navigate = useNavigate();

  const handleCloseBookModal = () => {
    setShowModal(false);
  };

  const handleOpenBookModal = () => {
    setShowModal(true);
  };
  const handleCloseConfirmModal = () => {
    setConfirmationModal(false);
    setSelectedSpot(null);
  };
  

  const handleOpenModal = (spot) => {
    setparkingSpot(spot);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

 const confirmBooking = async (selected, slotNumber = null) => {
    if (!selected || !selected.id) {
      console.log("No spot selected or invalid spot");
      return;
    }

    let token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8081/parkingspaces/bookparking`,
        { spaceId: selected.id },
        {
          params: slotNumber ? { slotNumber } : {},
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      if (response.data) {
        console.log("Booking successful, opening confirmation modal...");
        setSelectedSlot(response.data);
        setShowModal(false)
        setConfirmationModal(true);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error booking parking:", error);
      alert("Booking failed. Try again.");
    }
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8081/parkingspaces/getAllParkingSpaces')
      .then((res) => {
        console.log(res.data);
        
        setAllSpots(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSearchPlace(e.target.value);
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
            // getParkingSpaces();

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

  const handleSearch = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in ",
        text: "Please login first.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    if (!searchplace || !searchplace.trim()) {
      Swal.fire({
        title: "Search place is empty!",
        text: "Please enter a valid location.",
        icon: "warning",
      });
      return; // Stop execution if searchedplace is empty
    }
    // Implement your search logic here
  };

  const handleBook = (spot) => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "You are not logged in ",
        text: "Please login first.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setSelectedSpot(spot)
    handleOpenBookModal()
   
  };
  const handleChooseRandom = async (space) => {
    setSelectedSpot(space);
    await confirmBooking(space); // Ensuring confirmBooking runs after state update
  };

  return (
    <div>
      <Navbar/>


      {loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
) : (
  <>
      {/* <div className='mt-32'>
        <div className="searchbox text-black flex items-center w-full max-w-xs sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md mx-auto bg-white rounded-lg shadow-md p-2">
          <input
            type="text"
            name=""
            id=""
            value={searchplace}
            onChange={handleChange}
            className="bg-transparent flex-grow p-3 outline-none"
            placeholder="Search city, place, address..."
          />
          {searchplace && (
            <div className="clearbtn">
              <FaX
                onClick={() => {
                  setSearchPlace("");
                }}
                className="mr-2"
              />
            </div>
          )}
          <div
            onClick={handleSearch}
            className="searchbtn p-3 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition duration-200"
          >
            <FaSearch className="w-5 h-5" />
          </div>
        </div>
      </div> */}
      <div className="p-8 mt-32">
        <h2 className="text-3xl text-center font-bold mb-8">Explore All Parking Spaces</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {allSpots.map((spot, index) => (
            <div
              key={index}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            >
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <img
                  src={`http://localhost:8081/${spot.parkingSpaceImage}` ||
                  "parkingspace.jpeg"}
                  alt={spot.lotName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{spot.lotName}</h3>
                  <p className="text-gray-600">{spot.address}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      onClick={() => handleOpenModal(spot)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      View on Map
                    </a>
                    <button
                      className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                      onClick={() => handleBook(spot)}
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
      {parkingSpot && (
        <ViewOnMapModal
          parking_spot={parkingSpot}
          open={open}
          onClose={handleCloseModal}
        />
      )}
      <BookSlotModal
        spot={selectedSpot}
        open={showModal}
        onClose={handleCloseBookModal}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        onBook={(slotNumber) => confirmBooking(selectedSpot, slotNumber)}
        handleChooseRandom={handleChooseRandom}
      />
        {selectedSlot && (
              <ConfirmBookingModal
                spot={selectedSpot}
                open={confirmationModal}
                onClose={handleCloseConfirmModal}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                startPayment={startPayment}
              />
            )}
    
    </>
          )}
          </div>
  );
};

export default AllParkingSpots;