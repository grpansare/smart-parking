import React from "react";
import "../ParkingOwnerProfile.css";

const ParkingSpaceModal = ({
  tempParkingDetails,
  formErrors,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Parking Space Information</h3>
        <div className="modal-form">
          <label>Parking Lot Name:</label>
          <input
            type="text"
            name="lotName"
            value={tempParkingDetails.lotName}
            onChange={onChange}
          />
          {formErrors.parkingLotName && (
            <p className="modal-error">{formErrors.parkingLotName}</p>
          )}

          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={tempParkingDetails.address}
            onChange={onChange}
          />
          {formErrors.address && (
            <p className="modal-error">{formErrors.address}</p>
          )}

          <label>Total Number of Slots:</label>
          <input
            type="number"
            name="totalSlots"
            value={tempParkingDetails.totalSlots}
            onChange={onChange}
          />
          {formErrors.totalSlots && (
            <p className="modal-error">{formErrors.totalSlots}</p>
          )}

          <label>Number of Floors:</label>
          <input
            type="number"
            name="numberOfFloors"
            value={tempParkingDetails.numberOfFloors}
            onChange={onChange}
          />
          {formErrors.numberOfFloors && (
            <p className="modal-error">{formErrors.numberOfFloors}</p>
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

export default ParkingSpaceModal;
