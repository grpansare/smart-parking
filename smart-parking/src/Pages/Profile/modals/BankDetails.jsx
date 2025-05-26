import React from "react";
import "../ParkingOwnerProfile.css";

const BankDetailsModal = ({
  tempBankDetails,
  formErrors,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Bank Details</h3>
        <div className="modal-form">
          <label>Account Holder Name:</label>
          <input
            type="text"
            name="accountHolderName"
            value={tempBankDetails.accountHolderName}
            onChange={onChange}
          />
          {formErrors.accountHolderName && (
            <p className="modal-error">{formErrors.accountHolderName}</p>
          )}

          <label>Bank Name:</label>
          <input
            type="text"
            name="bankName"
            value={tempBankDetails.bankName}
            onChange={onChange}
          />
          {formErrors.bankName && (
            <p className="modal-error">{formErrors.bankName}</p>
          )}

          <label>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={tempBankDetails.accountNumber}
            onChange={onChange}
          />
          {formErrors.accountNumber && (
            <p className="modal-error">{formErrors.accountNumber}</p>
          )}

          <label>IFSC Code:</label>
          <input
            type="text"
            name="ifscCode"
            value={tempBankDetails.ifscCode}
            onChange={onChange}
          />
          {formErrors.ifscCode && (
            <p className="modal-error">{formErrors.ifscCode}</p>
          )}
        </div>
        <div className="modal-buttons">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-save" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
