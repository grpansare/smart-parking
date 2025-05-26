import React, { useEffect, useState } from "react";
import "./AllUserHistory.css";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { format } from "date-fns";

const AllUserHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusUpdating, setStatusUpdating] = useState(null);

  const { ownerDetails } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (ownerDetails) {
      getBookingDetails();
    }
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
    } catch (e) {
      return "-";
    }
  };
  
  const calculateDuration = (start, end) => {
    const durationInSeconds = end - start;
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  const getBookingDetails = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8081/api/bookings/${ownerDetails.parkingSpaces[0].id}/getbookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    if (newStatus === "") return;
    
    const token = Cookies.get("jwt") || localStorage.getItem("token");
    setStatusUpdating(bookingId);
    
    try {
      const response = await axios.put(
        `http://localhost:8081/api/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the booking status in the local state
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, bookingStatus: newStatus } 
          : booking
      );
      
      setBookings(updatedBookings);
      
      // If status changed to Completed and no departure time exists, set it to now
      if (newStatus === "Completed") {
        const bookingToUpdate = bookings.find(b => b.id === bookingId);
        if (bookingToUpdate && !bookingToUpdate.departureTime) {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          
          const departureResponse = await axios.put(
            `http://localhost:8081/api/bookings/${bookingId}/departure`,
            { departureTime: currentTimestamp },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          // Update departure time in local state
          const updatedBookingsWithTime = updatedBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, departureTime: currentTimestamp } 
              : booking
          );
          
          setBookings(updatedBookingsWithTime);
        }
      }
      
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status. Please try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking?.parkingUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.parkingUser?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking?.carNumber && booking.carNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || 
      booking.bookingStatus?.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="user-history-container">
      <h1>Bookings</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, email, or car number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Car Number</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.parkingUser.fullname}</td>
                <td>{booking.parkingUser.email}</td>
                <td className="text-center">{booking.carNumber ? booking.carNumber : "-"}</td>
                <td>{new Date(booking.arrivalTime * 1000).toLocaleString()}</td>
                <td>
                  {booking.departureTime
                    ? new Date(booking.departureTime * 1000).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {booking.departureTime
                    ? calculateDuration(booking.arrivalTime, booking.departureTime)
                    : "-"}
                </td>
                <td>{booking.amount}</td>
                <td>
                  <span
                    className={`status-badge ${booking.bookingStatus?.toLowerCase()}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>
                <td>
                  {statusUpdating === booking.id ? (
                    <span className="loading-spinner">Updating...</span>
                  ) : (
                    <select
                      className={`status-dropdown ${booking.bookingStatus?.toLowerCase()}-dropdown`}
                      value=""
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                    >
                      <option value="">Change Status</option>
                      <option value="Active" disabled={booking.bookingStatus === "Active"}>
                        Active
                      </option>
                      <option value="Completed" disabled={booking.bookingStatus === "Completed"}>
                        Completed
                      </option>
                      <option value="Canceled" disabled={booking.bookingStatus === "Canceled"}>
                        Canceled
                      </option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUserHistory;