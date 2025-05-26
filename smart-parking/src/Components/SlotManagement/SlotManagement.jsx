import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import "./SlotManagement.css";
import { Alert, Button, Snackbar } from "@mui/material";

const SlotManagement = ({ addnewslot }) => {
  const [slotImage, setSlotImage] = useState();
  const [parkingSpace, setParkingSpace] = useState();
  const fileInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [parkingImage, setparkingImage] = useState(null);
  const [floors, setFloors] = useState([]);
  const [slotsPerFloor, setSlotsPerFloor] = useState();
  const [open, setOpen] = useState();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleCLose = () => {
    setOpen(false);
  };
  useEffect(() => {
    getParkingSpace();
  }, []);
  const handleSubmit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const getParkingSpace = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8081/parkingowner/parkingspace/${currentUser.email}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      setParkingSpace(response.data);

      setSlotsPerFloor(response.data.totalSlots / response.data.numberOfFloors);

      // console.log("parking space-", parkingSpace.parkingSlot);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const onAddNewSlot = async () => {
    await addnewslot();
    getParkingSpace();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Please select an image file");
      return;
    }

    // Create a preview URL and update state
    const imageUrl = URL.createObjectURL(file);
    setparkingImage(imageUrl);

    let token = Cookies.get("jwt") || localStorage.getItem("token");

    console.log("Selected File:", file);
    console.log("Token:", token);

    const formData = new FormData();
    formData.append("file", file); // Use file for upload
    formData.append("lotName", parkingSpace.lotName);

    try {
      const response = await axios.put(
        "http://localhost:8081/parkingspaces/updateimage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // alert("File uploaded successfully");
      handleOpen();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div className="main-container flex w-full">
      <div className="left-section  border-3">
        <div className="slot-image">
          <div className="user-profile-picture flex flex-col  items-center ">
            <img
              src={
                parkingImage ||
                (parkingSpace?.parkingSpaceImage &&
                  `http://localhost:8081/${parkingSpace.parkingSpaceImage.trim()}`) ||
                "../parkingspace.jpeg"
              }
              alt="Profile"
              crossOrigin="anonymous"
            />

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
            />
            <button className="mx-auto mt-5" onClick={handleSubmit}>
              Change Image
            </button>
            <p className="text-3xl font-mono">{parkingSpace?.lotName}</p>
            <p className="p-2 text-center">
              <b>Address</b>: {parkingSpace?.address}
            </p>
          </div>
        </div>
      </div>
      <div className="right-section border-4 p-4">
        <div className="flex justify-end p-4 gap-4">
          <div className="flex items-center justify-center">
            <div className="reserved rounded"></div>
            <p>Reserved</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="available rounded"></div>
            <p>Available</p>
          </div>
        </div>

        <div className="addslotbtn flex w-full justify-end  p-2">
          <Button variant="contained" onClick={onAddNewSlot}>
            Add Slot
          </Button>
        </div>

        {Array.from({ length: parkingSpace?.numberOfFloors }).map(
          (_, floorIndex) => {
            const slotsPerFloor = Math.ceil(
              parkingSpace.totalSlots / parkingSpace.numberOfFloors
            );
            const start = floorIndex * slotsPerFloor;
            const end = start + slotsPerFloor;
            const floorSlots = parkingSpace?.parkingSlot?.slice(start, end);

            return (
              <div key={floorIndex} className="floor mb-3">
                <p className="w-32">Floor {floorIndex + 1}</p>
                <div className="slot-container flex flex-col">
                  <div className="slots flex flex-wrap gap-3 w-70 p-3 text-black">
                    {floorSlots?.map((slot, i) => (
                      <div
                        key={slot.slotId}
                        className="slot p-2 w-11 flex items-center justify-center rounded-md"
                        style={{
                          border: "1px solid gray",
                          backgroundColor: slot.available ? "white" : "gray",
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleCLose}
      >
        <Alert
          onClose={handleCLose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Parking Image Updated Successfully
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SlotManagement;
