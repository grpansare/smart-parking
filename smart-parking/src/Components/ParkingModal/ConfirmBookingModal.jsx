import { Modal, Box, Button, Typography, Divider } from "@mui/material";
import "../SlotManagement/SlotManagement.css";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useSelector } from "react-redux";
import axios from "axios";
import { cancelBooking } from "../../Utils/BookingFunctions";
import { AccessTime, MonetizationOn } from "@mui/icons-material"; // Import icons
import { FaCar } from "react-icons/fa";

dayjs.extend(duration);

export const ConfirmBookingModal = ({
  spot,
  selectedSlot,
  setSelectedSlot,
  open,
  onClose,
  onBook,
  startPayment,
}) => {
  const { arrivalTime, departureTime, currentUser } = useSelector(
    (state) => state.user
  );
  console.log(currentUser);

  const [totalAmount, setTotalAmount] = useState(0);
  const [arrival, setArrival] = useState(
    arrivalTime ? dayjs(arrivalTime) : dayjs()
  );
  const [departure, setDeparture] = useState(
    departureTime ? dayjs(departureTime) : dayjs().add(1, "hour")
  );

  // Format dates properly
  const formattedArrival = arrival.format("hh:mm A | DD MMM YYYY");
  const formattedDeparture = departure.format("hh:mm A | DD MMM YYYY");

  useEffect(() => {
    setTotalAmount(calculateTotalAmount()); // Update amount when arrival/departure changes
  }, [arrival, departure]);

  const beginPayment = () => {
    const paymentData = {
      amount: totalAmount,
      name: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.contactno,
    };
    const bookingData = {
      userId: currentUser.userId,
      parkingLotId: spot.spaceId || spot.id || spot.spaceIdd,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      amount: totalAmount,
      
    };
    startPayment(paymentData, bookingData);
  };

  const onCancelBooking = () => {
    cancelBooking(selectedSlot, spot);
    setSelectedSlot(null);
    onClose();
  };

  const calculateTotalAmount = () => {
    if (!spot) return 0;
    const diff = dayjs.duration(departure.diff(arrival));
    const hours = diff.hours();
    const minutes = diff.minutes();
    console.log(spot);
    console.log(hours, minutes);

    if (hours < 0 || minutes < 0) return 0;

    let pricePerMin = spot.pricingPerHour / 60;
    let minAmount = pricePerMin * minutes;
    let hoursAmount = hours * spot.pricingPerHour;
    console.log((minAmount + hoursAmount).toFixed(2));

    return (minAmount + hoursAmount).toFixed(2);
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
        <div style={{ overflowY: "auto", flexGrow: 1, maxHeight: "60vh" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Confirm Your Booking
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {spot?.lotName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Address:</strong> {spot?.address}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Booking Details */}
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            <strong>Selected Slot:</strong> {selectedSlot}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <AccessTime sx={{ color: "green" }} />
            <Typography variant="body1">
              <strong>Arrival:</strong> {formattedArrival}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <AccessTime sx={{ color: "red" }} />
            <Typography variant="body1">
              <strong>Departure:</strong> {formattedDeparture}
            </Typography>
          </Box>
          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <FaCar sx={{ color: "red" }} />
            <Typography variant="body1">
              <strong>Your Vehicle Number:</strong> {currentUser?.vehicleInfo[0]?.licencePlate ||"Not Provided"}
            </Typography>
          </Box> */}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <MonetizationOn sx={{ color: "#FFD700" }} />
            <Typography variant="body1">
              <strong>Pricing per Hour:</strong> ₹{spot?.pricingPerHour}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <MonetizationOn sx={{ color: "#32CD32" }} />
            <Typography variant="body1">
              <strong>Total Amount:</strong> ₹{totalAmount}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please review your booking details. Once confirmed, you'll be
            redirected to the payment page.
          </Typography>
        </div>

        {/* Footer section with buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelBooking}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 600,
              backgroundColor: "#f5f5f5",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={beginPayment}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 600,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
