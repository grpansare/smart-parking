import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { currentUser } = useSelector((state) => state.user);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);

  const calculateDuration = (start, end) => {
    const durationInSeconds = end - start;
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/bookings/${currentUser.userId}`,
        { withCredentials: true }
      );
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on selected status
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.bookingStatus === filter);

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to previous page
  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  
  // Go to next page
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="booking-history-container">
      <h2 className="booking-title">Booking History</h2>
      <div className="filter-options">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading bookings...</p>
      ) : (
        <div className="booking-list">
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <div className="booking-item" key={booking.id}>
                <h3>Booking ID: {booking.id}</h3>
                <div className="booking-info">
                  <span>
                    <strong>Location:</strong> {booking.address}
                  </span>
                  <span>
                    <strong>Status:</strong> {booking.bookingStatus}
                  </span>
                </div>
                <div className="booking-info">
                  <span>
                    <strong>Amount Paid:</strong> ₹{booking.amount}
                  </span>
                  <span>
                    <strong>Duration:</strong>{" "}
                    {calculateDuration(booking.arrivalTime, booking.departureTime)}
                  </span>
                </div>
                <div className="booking-info">
                  <span>
                    <strong>Entry:</strong>{" "}
                    {new Date(booking.arrivalTime * 1000).toLocaleString()}
                  </span>
                  <span>
                    <strong>Exit:</strong>{" "}
                    {new Date(booking.departureTime * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-bookings">No bookings found.</p>
          )}
          
          {filteredBookings.length > 0 && (
            <div className="pagination">
              <button 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`page-number ${currentPage === i + 1 ? "active" : ""}  text-black hover:bg-slate-200"`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="pagination-button text-black hover:bg-slate-200"
              >
                Next
              </button>
            </div>
          )}
          
          {filteredBookings.length > 0 && (
            <div className="pagination-info">
              Showing {indexOfFirstBooking + 1}-
              {Math.min(indexOfLastBooking, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;