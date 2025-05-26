import { Box, Modal, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

import React, { useState } from "react";
import { FaCar, FaPlusCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

// import NoVehicleImage from 'no-vehicleimgae.jpeg'; // Place your image in the assets folder
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 5,
};
const VehicleInfo = ({ setVehicles, vehicles }) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleVehicleUpdate = async (e) => {
    e.preventDefault();
    let token = Cookies.get("jwt");
    console.log(token);
    if (!token) {
      token = localStorage.getItem("token");
    }
    console.log(formData);

    if (token) {
      try {
        const res = await axios.post(
          `http://localhost:8081/user/addvehicle/${currentUser.email}`,
          formData,
          {
            withCredentials: true, // ✅ Send JWT cookie
          }
        );
        handleClose()
        console.log(res.data);
        if (res.status === 201) {
          setVehicles(res.data);
        }

        console.log("VehicleInfo info:", res.data); // ✅ Access response data properly
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };
  return (
    <div className="vehicle-info-container">
      {vehicles.length > 0 ? (
        <div className="vehicle-form">
          <h3 className="flex items-center gap-2">
            <FaCar /> Vehicle Information
          </h3>
          <div className="input-group ">
            <label>Car Make:</label>
            <input
              type="text"
              value={vehicles[0].carMake}
              onChange={handleChange}
              name="carMake"
              placeholder="Enter car make"
              className="border-2 p-3 rounded-lg"
            />
          </div>
          <div className="input-group">
            <label>Car Model:</label>
            <input
              type="text"
              value={vehicles[0].model}
              onChange={handleChange}
              name="model"
              placeholder="Enter car model"
              className="border-2 p-3 rounded-lg"
            />
          </div>
          <div className="input-group">
            <label>Car Color:</label>
            <input
              type="text"
              value={vehicles[0].color}
              onChange={handleChange}
              name="color"
              placeholder="Enter car color"
              className="border-2 p-3 rounded-lg"
            />
          </div>
          <div className="input-group">
            <label>License Plate:</label>
            <input
              type="text"
              value={vehicles[0].licencePlate}
              onChange={handleChange}
              name="licencePlate"
              placeholder="Enter license plate number"
              className="border-2 p-3 rounded-lg"
            />
          </div>
          <button className="flex items-center gap-3 mx-auto mt-2" onClick={handleVehicleUpdate}>
            <FaPlusCircle /> Add Another Vehicle
          </button>
        </div>
      ) : (
        <div className="no-vehicles">
          {/* <img src={NoVehicleImage} alt="No Vehicles" /> */}
          <h1>No Vehicles Available</h1>
          <p>Please add your vehicle information.</p>
          <button className="flex items-center" onClick={handleOpen}>
            <FaPlusCircle /> Add Vehicle Information
          </button>
        </div>
      )}

      <Modal
        open={open}
        onClose={handleClose} // Keeps modal close functionality via ESC key or specific triggers
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          onClick: (e) => e.stopPropagation(), // Prevents the modal from closing on backdrop click
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: "400px",
            maxWidth: "90%", // Responsive width
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click events inside Box from propagating
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "black",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
            aria-label="Close modal"
          >
            &times;
          </button>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <section>
              <div className="text-center border-2 border-gray-200 rounded-lg shadow-md p-6">
                <form
                  className="rounded-lg bg-white p-8 shadow-lg max-w-md mx-auto"
                  onSubmit={handleVehicleUpdate}
                >
                  <h3 className="text-gray-800 font-bold text-2xl mb-4">
                    Vehicle Information
                  </h3>

                  <div className="vehicle-form">
                    <h3>
                      <FaCar /> Vehicle Information
                    </h3>
                    <div className="input-group">
                      <label>Car Make:</label>
                      <input
                        type="text"
                        value={vehicles[0]?.carMake}
                        onChange={handleChange}
                        name="carMake"
                        placeholder="Enter car make"
                      />
                    </div>
                    <div className="input-group">
                      <label>Car Model:</label>
                      <input
                        type="text"
                        value={vehicles[0]?.model}
                        onChange={handleChange}
                        name="model"
                        placeholder="Enter car model"
                      />
                    </div>
                    <div className="input-group">
                      <label>Car Color:</label>
                      <input
                        type="text"
                        value={vehicles[0]?.color}
                        onChange={handleChange}
                        name="color"
                        placeholder="Enter car color"
                      />
                    </div>
                    <div className="input-group">
                      <label>License Plate:</label>
                      <input
                        type="text"
                        value={vehicles[0]?.licencePlate}
                        onChange={handleChange}
                        name="licencePlate"
                        placeholder="Enter license plate number"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 my-4"
                  >
                    Add
                  </button>
                </form>
              </div>
            </section>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default VehicleInfo;
