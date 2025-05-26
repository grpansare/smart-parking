import React, { useEffect, useState } from "react";
import { FaBars, FaCar, FaPlusCircle, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";
import { setUser } from "../../Store/UserSlice/UserSlice";
import ProfileDropdown from "../DropDown/ProfileDropdown";
import LoginDropDown from "../Dropdown/LoginDropDown";
import axios from "axios";
import RegisterDropDown from "../Dropdown/RegisterDropDown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicle, setVehicleInfo] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const token = Cookies.get("jwt") || localStorage.getItem("token");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getUserInfo();
    getVehicleInfo();
  }, []);

  const getVehicleInfo = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    
    if (token && currentUser?.email) {
      try {
        const res = await axios.get(
          `http://localhost:8081/user/getvehiclesInfo/${currentUser.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (res.data.length > 0) {
          const vehicleInfo = res.data;
          const newCurrentUser = { ...currentUser, vehicleInfo };
          dispatch(setUser(newCurrentUser));
        } else if (res.data.length === 0) {
          setTimeout(openModal, 2000);
        }
      } catch (e) {
        console.error("Error fetching vehicle info:", e);
      }
    }
  };

  const getUserInfo = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");

    if (token) {
      try {
        const res = await axios.get("http://localhost:8081/user/profile", {
          withCredentials: true,
        });
        dispatch(setUser(res.data));
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };

  const handleVehicleUpdate = async (e) => {
    e.preventDefault();
    let token = Cookies.get("jwt") || localStorage.getItem("token");

    if (token && currentUser?.email) {
      try {
        const res = await axios.post(
          `http://localhost:8081/user/addvehicle/${currentUser.email}`,
          vehicle,
          { withCredentials: true }
        );
        
        closeModal();
        if (res.status === 201) {
          const vehicleInfo = res.data;
          const newCurrentUser = { ...currentUser, vehicleInfo };
          dispatch(setUser(newCurrentUser));
        }
      } catch (error) {
        console.error("Error updating vehicle info:", error);
      }
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img src="../../logo.png" alt="ParkEase Logo" className="h-10" />
              <span className="ml-2 text-xl font-bold text-gray-800">ParkEase</span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {currentUser && token ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/dashboard/my-booking" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    My Bookings
                  </Link>
                  <Link to="/dashboard/parkingspaces" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    All Parking Spaces
                  </Link>
                  <Link to="/dashboard/payments" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Payments
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/parkingspaces" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    Parking Spaces
                  </Link>
                  <LoginDropDown />
                  <RegisterDropDown />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {currentUser && token ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link to="/dashboard/my-booking" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    My Bookings
                  </Link>
                  <Link to="/dashboard/parkingspaces" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    All Parking Spaces
                  </Link>
                  <Link to="/dashboard/payments" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    Payments
                  </Link>
                  <div className="px-3 py-2">
                    <ProfileDropdown />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    Home
                  </Link>
                  <Link to="/parkingspaces" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    Parking Spaces
                  </Link>
                  <div className="px-3 py-2">
                    <LoginDropDown />
                  </div>
                  <div className="px-3 py-2">
                    <RegisterDropDown />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Vehicle Info Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-auto mt-20">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FaCar /> Vehicle Information
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Car Make:</label>
              <input
                type="text"
                value={vehicle.carMake || ""}
                onChange={handleChange}
                name="carMake"
                placeholder="Enter car make"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Car Model:</label>
              <input
                type="text"
                value={vehicle.model || ""}
                onChange={handleChange}
                name="model"
                placeholder="Enter car model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Car Color:</label>
              <input
                type="text"
                value={vehicle.color || ""}
                onChange={handleChange}
                name="color"
                placeholder="Enter car color"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">License Plate:</label>
              <input
                type="text"
                value={vehicle.licencePlate || ""}
                onChange={handleChange}
                name="licencePlate"
                placeholder="Enter license plate number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Later
              </button>
              <button
                onClick={handleVehicleUpdate}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlusCircle /> Add Vehicle
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;