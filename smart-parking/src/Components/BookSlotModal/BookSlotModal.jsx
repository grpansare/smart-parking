import { Modal, Box, Button, Typography, Divider } from "@mui/material";
import { useState } from "react";
import DateTimePickerComponent from "../DateTimePicker/DateTImePicker";
import Cookies from "js-cookie";
import axios from "axios";
import { Lock } from "lucide-react";

export const BookSlotModal = ({
  spot,
  selectedSlot,
  setSelectedSlot,
  open,
  onClose,
  onBook,
}) => {
  const [autoSelect, setAutoSelect] = useState(false);

  const handleClose = () => {
    onClose();
    setSelectedSlot(null);
  };

  const handleSlotClick = (slotId) => {
    setSelectedSlot(slotId);
  };

  const handleRandom = async () => {
    await confirmBooking(spot, null);
  };

  const confirmBooking = async (selected, slotNumber = null) => {
    if (!selected) {
      console.log("No spot selected or invalid spot");
      return;
    }

    const token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8081/parkingspaces/bookparking`,
        { spaceId: selected.id },
        {
          params: slotNumber ? { slotNumber } : {},
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        console.log("Booking successful");
        setSelectedSlot(response.data);
        // Trigger confirmation modal here if needed
      }
    } catch (error) {
      console.error("Error booking parking:", error);
      alert("Booking failed. Try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 650,
          maxHeight: "90vh",
          p: 7,
          bgcolor: "white",
          margin: "auto",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">{spot?.lotName}</Typography>
        <Typography variant="body1">Address: {spot?.address}</Typography>
        <Typography variant="body1">
          Pricing Per Hour: ₹ {spot?.pricingPerHour}
        </Typography>

        <Box mt={3}>
          <DateTimePickerComponent color="white" />
        </Box>

        <Box mt={4} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Slot Selection Options:
          </Typography>

          <Box mt={2} display="flex" gap={2}>
            <Button
              color="primary"
              variant={autoSelect ? "outlined" : "contained"}
              onClick={() => setAutoSelect(false)}
              startIcon={<Lock size={16} />}
            >
              Choose Specific Slot
            </Button>
            <Button
              color="secondary"
              variant={autoSelect ? "contained" : "outlined"}
              onClick={handleRandom}
            >
              Auto-Assign Slot
            </Button>
          </Box>
        </Box>

        {!autoSelect && (
          <>
            <Divider sx={{ my: 2 }} />
            {spot?.totalSlots > 0 ? (
              <Box className="slots">
                {Array.from({ length: spot?.numberOfFloors }).map(
                  (_, floorIndex) => (
                    <Box
                      key={floorIndex}
                      display="flex"
                      gap={2}
                      mb={2}
                      alignItems="center"
                    >
                      <Typography className="w-24 text-center">
                        Floor {floorIndex + 1}
                      </Typography>
                      <Box className="slot-container flex flex-wrap gap-2">
                        {spot?.parkingSlot
                          ?.slice(floorIndex * 30, (floorIndex + 1) * 30)
                          .map((slot) => (
                            <Box
                              key={slot.slotId}
                              className={`slot p-2 w-11 text-center rounded-md text-sm ${
                                slot.available
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                              onClick={() =>
                                slot.available && handleSlotClick(slot.slotId)
                              }
                              sx={{
                                border: "1px solid gray",
                                backgroundColor: slot.available
                                  ? selectedSlot === slot.slotId
                                    ? "gray"
                                    : "white"
                                  : "gray",
                              }}
                            >
                              {slot.slotId}
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            ) : (
              <Typography color="error">No Slots Available</Typography>
            )}
          </>
        )}

        {/* Footer Buttons */}
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          position="sticky"
          bottom={0}
          bgcolor="white"
          pt={2}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!autoSelect && !selectedSlot}
            sx={{ mr: 1 }}
            onClick={() =>
              autoSelect
                ? confirmBooking(spot, null)
                : onBook(selectedSlot)
            }
          >
            <b>{autoSelect ? "Auto Book Slot" : "Book Selected Slot"}</b>
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
