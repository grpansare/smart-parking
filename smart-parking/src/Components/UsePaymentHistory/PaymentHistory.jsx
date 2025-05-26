import React, { useEffect, useState } from "react";
import "./PaymentHistory.css";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";

const UserPaymentHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    getPayments();
  }, []); // Empty dependency array to run only once on mount

  const getPayments = async () => {
    setLoading(true);
    const token = Cookies.get("jwt") || localStorage.getItem("token");

    try {
      // Check if ownerDetails and parkingSpaces exist
    

        const response = await axios.get(
          `http://localhost:8081/api/payment/getAllUserPayments/${currentUser.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(response.data);
        setPaymentHistory(response.data); // Fixed: was using res.data
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch payment history");
      setLoading(false);
    }
  };

  // Only filter when paymentHistory exists
  const filteredTransactions =
    paymentHistory?.filter((transaction) => {
      // Check if transaction and required properties exist
      if (!transaction) return false;

      const matchesSearch = transaction.lotName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        transaction.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const formatDate = (date) => {
    if (date) {
      const date1 = `${date[0]}-${date[1]}-${date[2]}`;

      return date1;
    }
    return null;
  };

  return (
    <div className="payment-history-container">
      <h1 className="payment-history-title">Payment History</h1>

      <div className="filters-container">
        <div className="search-container" style={{ flex: 3 }}>
          <input
            type="text"
            placeholder="Search by space or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-filter"
          />
        </div>

        <div className="filter-container" style={{ flex: 1 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-message">Loading payment history...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="transactions-list">
          {filteredTransactions.length === 0 ? (
            <div className="no-transactions">No payment records found</div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id || transaction._id}
                className="transaction-card"
              >
                <div className="transaction-header">
                  <h3 className="space-name">{transaction.lotName}</h3>
                  <span
                    className={`status-badge ${transaction.status?.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                </div>

                <div className="transaction-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="amount-value">₹{transaction.amount}</span>
                    </div>
                  </div>
                  <div className="detail-item address-item">
                    <span className="detail-label">Payment Id:</span>
                    <span className="detail-value ">
                      {transaction.paymentId || "       -"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserPaymentHistory;
