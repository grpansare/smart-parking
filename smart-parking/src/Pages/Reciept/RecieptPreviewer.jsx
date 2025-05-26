import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import Cookies from "js-cookie";
import ParkingDirections from "../../Components/ParkingDirections/ParkingDirections";
import { Alert, Snackbar } from "@mui/material";

const Receipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    handleClick();
    fetchReceipt(id);
  }, [id]);

  const fetchReceipt = async (bookingId) => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    console.log(token);

    try {
      const response = await axios.get(
        `http://localhost:8081/api/bookings/generateReciept/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReceipt(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching receipt:", err);
      setError("Failed to load receipt. Please try again later.");
      setLoading(false);
    }
  };
  const handleShowDirection = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const downloadReceipt = () => {
    if (!receipt) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Smart Car Parking - Receipt", 60, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Receipt No.: ${receipt.receiptId}`, 20, 40);
    doc.text(`Username: ${receipt.customerName}`, 20, 50);
    doc.text(`Parking Space: ${receipt.lotName}`, 20, 60);
    doc.text(`Address: ${receipt.parkingSpotAddress}`, 20, 70);
    doc.text(`Amount Paid: ₹${receipt.amount}`, 20, 80);
    doc.text(
      `Date & Time: ${new Date(receipt.arrivalTime).toLocaleString()}`,
      20,
      90
    );
    doc.text("Thank you for using our service!", 60, 110);

    doc.save(`Receipt_${receipt.receiptId}.pdf`);
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading receipt...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-lg mt-44 mb-20 mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl text-center font-serif font-bold mb-4 text-blue-700">
        Receipt Details
      </h2>
      <div className="border-b pb-4 mb-4">
        <p className="text-gray-700">
          <strong>Receipt No.:</strong> {receipt.recieptId}
        </p>
        <p className="text-gray-700">
          <strong>Username:</strong> {receipt.customerName}
        </p>
        <p className="text-gray-700">
          <strong>Parking Space:</strong> {receipt.lotName}
        </p>
        <p className="text-gray-700">
          <strong>Address:</strong> {receipt.parkingSpotAddress}
        </p>
        <p className="text-gray-700">
          <strong>Amount:</strong> ₹{receipt.amount}
        </p>
        <p className="text-gray-700">
          <strong>Arrival Time:</strong>{" "}
          {new Date(receipt.arrivalTime * 1000).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>Departure Time:</strong>{" "}
          {new Date(receipt.departureTime * 1000).toLocaleString()}

        </p>
      </div>

      <div className="text-center flex gap-2 justify-center">
        <button
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
          onClick={downloadReceipt}
        >
          Download Receipt
        </button>
        <button
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
          onClick={handleShowDirection}
        >
          Show Directions
        </button>
      </div>
      <ParkingDirections
        PARKING_ADDRESS={receipt.parkingSpotAddress}
        open={showModal}
        onClose={handleModalClose}
      />
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Slot booked successfully !!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Receipt;
