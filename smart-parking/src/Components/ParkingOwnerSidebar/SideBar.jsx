import React from "react";
import { Link } from "react-router-dom";
import { MenuBook } from "@mui/icons-material";

const ParkingOwnerSidebar = ({ logout }) => {
  return (
    <div className="w-[300px] h-screen bg-[#488A99] p-5  rounded-lg shadow-lg">
      {/* Heading */}
      <div className="flex items-center mb-5">
        <h3 className="text-white text-lg m-0">Parking Owner Dashboard</h3>
      </div>

      {/* Dashboard Links */}
      <div className="mt-7 space-y-4">
        <Link
          to="/parkingownerdash/"
          className="block px-4 py-2 bg-gray-200 text-gray-800 rounded transition duration-300 hover:bg-gray-400 hover:text-gray-900"
        >
          Manage Parking Slots
        </Link>
        <Link
          to="view-bookings"
          className="block px-4 py-2 bg-gray-200 text-gray-800 rounded transition duration-300 hover:bg-gray-400 hover:text-gray-900"
        >
          View Bookings
        </Link>
        
        <Link
          to="payment-history"
          className="block px-4 py-2 bg-gray-200 text-gray-800 rounded transition duration-300 hover:bg-gray-400 hover:text-gray-900"
        >
          Payment History
        </Link>
        {/* <Link
          to="/settings"
          className="block px-4 py-2 bg-gray-200 text-gray-800 rounded transition duration-300 hover:bg-gray-400 hover:text-gray-900"
        >
          Settings
        </Link> */}
      </div>
    </div>
  );
};

export default ParkingOwnerSidebar;
