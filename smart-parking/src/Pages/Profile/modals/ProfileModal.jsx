import React from "react";
import "../ParkingOwnerProfile.css";

const ProfileModal = ({
  tempProfileDetails,
  formErrors,
  onChange,
  onClose,
  onSave,
}) => {
  console.log(tempProfileDetails);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Profile Information</h3>
        <div className="modal-form">
          <label>Name:</label>
          <input
            type="text"
            name="fullname"
            value={tempProfileDetails.fullname}
            onChange={onChange}
          />
          {formErrors.name && <p className="modal-error">{formErrors.name}</p>}

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={tempProfileDetails.email}
            onChange={onChange}
          />
          {formErrors.email && (
            <p className="modal-error">{formErrors.email}</p>
          )}

          <label>Phone:</label>
          <input
            type="tel"
            name="contactno"
            value={tempProfileDetails.contactno}
            onChange={onChange}
          />
          {formErrors.phone && (
            <p className="modal-error">{formErrors.phone}</p>
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

export default ProfileModal;
