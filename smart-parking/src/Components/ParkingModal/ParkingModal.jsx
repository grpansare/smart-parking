import { Modal, Box, Button, Typography } from "@mui/material";

import { useState } from "react";
import DateTimePickerComponent from "../DateTimePicker/DateTImePicker";

export const ParkingModal = ({
  spot,
  selectedSlot,
  setSelectedSlot,
  open,
  onClose,
  onBook,
}) => {
  const handleSlotClick = (slotno) => {
    setSelectedSlot(slotno); // Set the new slot as selected
  };
  const handleClose = () => {
    onClose();
    setSelectedSlot(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 650,
          maxHeight: "80vh",
          p: 7,
          bgcolor: "white",
          margin: "auto",
          mt: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 2,
        }}
      >
        <div style={{ overflowY: "auto", flexGrow: 1, maxHeight: "60vh" }}>
          <Typography variant="h6">{spot?.lotName}</Typography>
          <Typography variant="body1">Address: {spot?.address}</Typography>
          <Typography variant="body1">
            Pricing Per Hour: ₹ {spot?.pricingPerHour}{" "}
          </Typography>

          <div className="time mt-3">
            <DateTimePickerComponent color="white" />
          </div>

          {spot?.totalSlots > 0 ? (
            <div className="slots mt-2">
              {Array.from({ length: spot?.numberOfFloors }).map(
                (_, floorIndex) => (
                  <div
                    key={floorIndex}
                    className="flex gap-3 border-2 p-3 justify-between w-100 mb-2"
                  >
                    <p className="w-24 flex justify-center items-center ">
                      Floor {floorIndex + 1}
                    </p>
                    <div className="slot-container flex p-3 gap-3">
                      <div className="slots flex flex-wrap gap-3 w-72  border text-black">
                        {spot?.parkingSlot
                          ?.slice(floorIndex * 30, (floorIndex + 1) * 30)
                          .map((slot, i) => (
                            <div
                              key={slot.slotId}
                              className={`slot p-2 w-11 flex items-center justify-center rounded-md ${
                                slot.available
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                              onClick={() => {
                                if (slot.available) {
                                  handleSlotClick(slot.slotId);
                                }
                              }}
                              style={{
                                border: "1px solid gray",
                                backgroundColor: slot.available
                                  ? selectedSlot === slot.slotId
                                    ? "gray" // Selected slot turns gray
                                    : "white" // Available but not selected slots remain white
                                  : "gray", // Unavailable slots are always gray
                              }}
                            >
                              {i + 1}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <Typography color="red">No Slots Available</Typography>
          )}
        </div>

        {/* Footer section with buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0 0",
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ flexGrow: 1, marginRight: 10 }}
            onClick={() => onBook(selectedSlot)}
            disabled={!selectedSlot} // Disable booking if no slot is selected
          >
            <b>Book Slot</b>
          </Button>

          <Button onClick={handleClose} variant="outlined" color="secondary">
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
