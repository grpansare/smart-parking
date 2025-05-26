import React, { useState, useRef, useEffect } from "react";
import "./ParkingOwnerProfile.css";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import ProfileModal from "./modals/ProfileModal";
import ParkingSpaceModal from "./modals/ParkingSpaceModal";
import SpaceDetailsModal from "./modals/BankDetails";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Box } from "lucide-react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import TextField from "@mui/material/TextField";
import { Logout } from "../../Store/UserSlice/UserSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Alert, InputAdornment, Snackbar } from "@mui/material";
import ChangePassword from "./modals/ChangePassword";

const ParkingOwnerProfile = () => {
  const [lotName, setlotName] = useState("");
  const [address, setAddress] = useState("");
  const [totalSlots, setTotalSlots] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const navigate = useNavigate();

  const [pricingPerHour, setPricingPerHour] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

  const [activeSection, setActiveSection] = useState("Parking Space");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showParkingSpaceModal, setShowParkingSpaceModal] = useState(false);
  const [showSpaceDetailsModal, setShowSpaceDetailsModal] = useState(false);
  const [ChangePasswordModal, setShowPasswordModal] = useState(false);

  const [tempProfileDetails, setTempProfileDetails] = useState();
  const [tempParkingDetails, setTempParkingDetails] = useState({
    lotName: "",
    address: "",
    totalSlots: "",
    numberOfFloors: "",
  });
  const [tempSpaceDetails, setTempSpaceDetails] = useState({
    accountHolderName: "",
    SpaceName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    lotName: "",
    address: "",
    totalSlots: "",
    numberOfFloors: "",
    accountHolderName: "",
    SpaceName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [open, setOpen] = useState(false);
  const [openSpace, setOpenSpace] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
   const fileInputRef = useRef(null);

  const handleOpne = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenPrice = () => {
    setOpenPrice(true);
  };
  const handlePriceClose = () => {
    setOpenPrice(false);
  };
  const handleOpenSpace = () => {
    setOpenSpace(true);
  };
  const handleSpaceClose = () => {
    setOpenSpace(false);
  };
  const { currentUser, ownerDetails } = useSelector((state) => state.user);
  console.log(ownerDetails);

  useEffect(() => {
    if (ownerDetails) {
      setTempProfileDetails({
        fullname: ownerDetails.fullname || "",
        email: ownerDetails.email || "",
        contactno: ownerDetails.contactno || "",
      });

      if (ownerDetails.parkingSpaces?.length > 0) {
        const parking = ownerDetails.parkingSpaces[0];
        setlotName(parking.lotName || "");
        setAddress(parking.address || "");
        setTotalSlots(parking.totalSlots || "");
        setPricingPerHour(parking.pricingPerHour);
        setAvailableFrom(
          dayjs()
            .hour(parking.availableFrom[0])
            .minute(parking.availableFrom[1])
            .second(parking.availableFrom[2])
        );
        setAvailableTo(
          dayjs(
            dayjs()
              .hour(parking.availableTo[0])
              .minute(parking.availableTo[1])
              .second(parking.availableTo[2])
          )
        );
        setNumberOfFloors(parking.numberOfFloors || "");
      }

      // If Space details are available:
      if (ownerDetails.bankDetails) {
        const bank = ownerDetails.bankDetails;
        setAccountHolderName(bank.accountHolderName || "");
        setBankName(bank.bankName || "");
        setAccountNumber(bank.accountNumber || "");
        setIfscCode(bank.ifscCode || "");
      }
    }
  }, [ownerDetails]);
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    // alert(value)
    setTempProfileDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleParkingInputChange = (e) => {
    const { name, value } = e.target;
    setTempParkingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpaceInputChange = (e) => {
    const { name, value } = e.target;
    setTempSpaceDetails((prev) => ({ ...prev, [name]: value }));
  };

  

  const validateProfileForm = () => {
    let errors = {};
    if (!/^[A-Za-z\s]+$/.test(tempProfileDetails.name)) {
      errors.name = "Name should only contain letters.";
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(tempProfileDetails.email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!/^\d{10}$/.test(tempProfileDetails.contactno)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateInfo = () => {
    setShowProfileModal(true);
  };

  const handleSaveProfileChanges = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    if (validateProfileForm()) {
      setUserDetails(tempProfileDetails);
      setShowProfileModal(false);
    }
    try {
      await axios.put(
        `http://localhost:8081/parkingowner/update/${ownerDetails.userId}`,
        tempProfileDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleOpne();
      console.log("==========================");
    } catch (Err) {
      console.log(Err);
    }
  };

  const handleSubmitParkingSpace = () => {
    setTempParkingDetails({
      lotName,
      address,
      totalSlots,
      numberOfFloors,
    });
    setShowParkingSpaceModal(true);
  };
  const handleUpdateClick = async () => {
    setEditMode(true);
    
  };
  const handleSaveClick=async()=>{
    setEditMode(false)
    const formData = new FormData();
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    formData.append("pricingPerHour", pricingPerHour);
    formData.append("availableFrom", dayjs(availableFrom).format("HH:mm:ss"));
    formData.append("availableTo", dayjs(availableTo).format("HH:mm:ss"));
    try {
      const response = await axios.put(
        `http://localhost:8081/parkingspaces/updatepriceandtime/${lotName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        handleOpenPrice(); // only show snackbar if update was successful
      }
      
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  const handleSaveParkingSpaceChanges = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    let errors = {};
    if (!/^[A-Za-z\s]+$/.test(tempParkingDetails.lotName)) {
      errors.lotName = "Parking Lot Name should only contain letters.";
    }
    if (!tempParkingDetails.address) {
      errors.address = "Address is required.";
    }
    if (!/^\d+$/.test(tempParkingDetails.totalSlots)) {
      errors.totalSlots = "Total Number of Slots should only contain numbers.";
    }
    if (!/^\d+$/.test(tempParkingDetails.numberOfFloors)) {
      errors.numberOfFloors = "Number of Floors should only contain numbers.";
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setlotName(tempParkingDetails.lotName);
      setAddress(tempParkingDetails.address);
      setTotalSlots(tempParkingDetails.totalSlots);
      setNumberOfFloors(tempParkingDetails.numberOfFloors);
      setShowParkingSpaceModal(false);
    }
    const id = ownerDetails.parkingSpaces[0].id;

    await axios.put(
      `http://localhost:8081/parkingspaces/update/${id}?userId=${ownerDetails.userId}`,
      tempParkingDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    handleOpenSpace();
  };

  const handleSubmitSpaceDetails = () => {
    setTempSpaceDetails({
      accountHolderName,
      SpaceName,
      accountNumber,
      ifscCode,
    });
    setShowSpaceDetailsModal(true);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Please select an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfilePicture(imageUrl);

    let token = Cookies.get("jwt") || localStorage.getItem("token");

    console.log("Selected File:", file);
    console.log("Token:", token);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", currentUser.email);

    try {
      const response = await axios.patch(
        "http://localhost:8081/user/uploadimage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     handleOpne()
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const handleSubmit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleSaveSpaceDetailsChanges = async () => {
    let token = Cookies.get("jwt") || localStorage.getItem("token");
    let errors = {};
    if (!/^[A-Za-z\s]+$/.test(tempSpaceDetails.accountHolderName)) {
      errors.accountHolderName =
        "Account Holder Name should only contain letters.";
    }
    if (!/^[A-Za-z\s]+$/.test(tempSpaceDetails.SpaceName)) {
      errors.SpaceName = "Space Name should only contain letters.";
    }
    if (!/^\d{11,16}$/.test(tempSpaceDetails.accountNumber)) {
      errors.accountNumber =
        "Account Number should be between 11 and 16 digits.";
    }
    if (!/^[A-Za-z0-9]{11}$/.test(tempSpaceDetails.ifscCode)) {
      errors.ifscCode =
        "IFSC Code should contain exactly 11 alphanumeric characters.";
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setAccountHolderName(tempSpaceDetails.accountHolderName);
      setSpaceName(tempSpaceDetails.SpaceName);
      setAccountNumber(tempSpaceDetails.accountNumber);
      setIfscCode(tempSpaceDetails.ifscCode);
      setShowSpaceDetailsModal(false);
    }
    await axios.put(
      `http://localhost:8081/parkingowner/${ownerDetails.userId}/update-Space`,
      tempSpaceDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(Logout());
        localStorage.removeItem("token");
        Cookies.remove("jwt", { path: "", domain: "" });
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        ).then(() => {
          navigate("/");
        });
      }
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Parking Space":
        return (
          <div className="parking-space-container">
            <h3>Parking Space</h3>
            <label>Parking Lot Name:</label>
            <input
              type="text"
              value={lotName}
              onChange={(e) => setlotName(e.target.value)}
              placeholder="Enter parking lot name"
            />
            {formErrors.lotName && (
              <p style={{ color: "red" }}>{formErrors.lotName}</p>
            )}
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
            {formErrors.address && (
              <p style={{ color: "red" }}>{formErrors.address}</p>
            )}
            <label>Total Number of Slots:</label>
            <input
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              placeholder="Enter total number of slots"
            />
            {formErrors.totalSlots && (
              <p style={{ color: "red" }}>{formErrors.totalSlots}</p>
            )}
            <label>Number of Floors:</label>
            <input
              type="number"
              value={numberOfFloors}
              onChange={(e) => setNumberOfFloors(e.target.value)}
              placeholder="Enter number of floors"
            />
            {formErrors.numberOfFloors && (
              <p style={{ color: "red" }}>{formErrors.numberOfFloors}</p>
            )}
            <button
              className="submit-button"
              onClick={handleSubmitParkingSpace}
            >
              Update
            </button>
          </div>
        );
      case "Pricing & Availability":
        return (
          <div className="pricing-availability-container">
            <h3>Pricing & Availability</h3>
            <label>Pricing per Hour:</label>
            <TextField
              type="number"
              value={pricingPerHour}
              className="border-2 mb-4 p-3 "
              disabled={!editMode}
              onChange={(e) => setPricingPerHour(e.target.value)}
              placeholder="Enter pricing per hour"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex mt-3 flex-col gap-4">
                <TimePicker
                  label="Available From"
                  disabled={!editMode}
                  value={availableFrom}
                  onChange={(newValue) => setAvailableFrom(newValue)}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Available To"
                  value={availableTo}
                  disabled={!editMode}
                  onChange={(newValue) => setAvailableTo(newValue)}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </div>
            </LocalizationProvider>

            {!editMode ? (
              <button
                className="submit-button mt-4"
                onClick={handleUpdateClick}
              >
                Update
              </button>
            ) : (
              <button
                className="submit-button mt-4"
                onClick={() => {
                  // Save logic here if needed
                  handleSaveClick()
                }}
              >
                Save
              </button>
            )}
          </div>
        );
      case "bank Details":
        return (
          <div className="bank-details-container">
            <h3>Bank Details</h3>
            <label>Account Holder Name:</label>
            <input
              type="text"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="Enter account holder name"
            />
            {formErrors.accountHolderName && (
              <p style={{ color: "red" }}>{formErrors.accountHolderName}</p>
            )}
            <label>Bank Name:</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter Space name"
            />
            {formErrors.bankName && (
              <p style={{ color: "red" }}>{formErrors.SpaceName}</p>
            )}
            <label>Account Number:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
            />
            {formErrors.accountNumber && (
              <p style={{ color: "red" }}>{formErrors.accountNumber}</p>
            )}
            <label>IFSC Code:</label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              placeholder="Enter IFSC code"
            />
            {formErrors.ifscCode && (
              <p style={{ color: "red" }}>{formErrors.ifscCode}</p>
            )}
            {/* // <button className="submit-button" onClick={handleSubmitSpaceDetails}>
            //   Update
            // </button> */}
          </div>
        );
      case "Security Settings":
        return (
          <div>
            <h3>Security Settings</h3>
            <div className="user-language-preference-container">
              <label>Language Preferences:</label>
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <button
              className="user-security-button"
              onClick={() => {
                setShowPasswordModal(true);
              }}
            >
              Change Password
            </button>
            <button className="user-security-button">
              Enable Two-Factor Authentication
            </button>
          </div>
        );
      case "Support & Feedback":
        return (
          <div className="user-support-buttons-container">
            <h3>Support & Feedback</h3>
            <button>Contact Support</button>
            <button>FAQs/Help</button>
            <button>Give Feedback</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="owner-profile-container">
      {showProfileModal && (
        <ProfileModal
          tempProfileDetails={tempProfileDetails}
          formErrors={formErrors}
          onChange={handleProfileInputChange}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfileChanges}
        />
      )}
      {showParkingSpaceModal && (
        <ParkingSpaceModal
          tempParkingDetails={tempParkingDetails}
          formErrors={formErrors}
          onChange={handleParkingInputChange}
          onClose={() => setShowParkingSpaceModal(false)}
          onSave={handleSaveParkingSpaceChanges}
        />
      )}

      {showSpaceDetailsModal && (
        <SpaceDetailsModal
          tempSpaceDetails={tempSpaceDetails}
          formErrors={formErrors}
          onChange={handleSpaceInputChange}
          onClose={() => setShowSpaceDetailsModal(false)}
          onSave={handleSaveSpaceDetailsChanges}
        />
      )}
      {ChangePasswordModal && (
        <ChangePassword onClose={() => setShowPasswordModal(false)} />
      )}

      <div className="owner-profile-section">
        <div className="owner-profile-left">
          <div className="owner-profile-picture">
          <img
              src={
                profilePicture ||
                (currentUser?.profileImage &&
                  `http://localhost:8081/uploads/${currentUser.profileImage.trim()}`) ||
                "../images.png"
              }
              alt="Profile"
              crossOrigin="anonymous"
            />
          <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
            />
            <button className="mx-auto mt-5" onClick={handleSubmit}>
              Change Profile
            </button>
          </div>
        </div>
        <div className="owner-profile-right">
          <label>Name:</label>
          <input
            type="text"
            value={tempProfileDetails?.fullname || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            placeholder="Enter your name"
          />
          {formErrors.name && <p style={{ color: "red" }}>{formErrors.name}</p>}
          <label>Email:</label>
          <input
            type="email"
            value={tempProfileDetails?.email || ""}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            placeholder="Enter your email"
          />
          {formErrors.email && (
            <p style={{ color: "red" }}>{formErrors.email}</p>
          )}
          <label>Phone:</label>
          <input
            type="tel"
            value={tempProfileDetails?.contactno}
            onChange={(e) =>
              setUserDetails({ ...userDetails, phone: e.target.value })
            }
            placeholder="Enter your phone number"
          />
          {formErrors.phone && (
            <p style={{ color: "red" }}>{formErrors.phone}</p>
          )}
          <button onClick={handleUpdateInfo}>Update Information</button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      <div className="horizontal-navbar">
        <button onClick={() => setActiveSection("Parking Space")}>
          Parking Space
        </button>
        <button onClick={() => setActiveSection("Pricing & Availability")}>
          Pricing & Availability
        </button>
        <button onClick={() => setActiveSection("bank Details")}>
          bank Details
        </button>
        <button onClick={() => setActiveSection("Security Settings")}>
          Security Settings
        </button>
        <button onClick={() => setActiveSection("Support & Feedback")}>
          Support & Feedback
        </button>
      </div>

      <div className="section-content">{renderSection()}</div>

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
          Profile Updated Successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSpace}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleSpaceClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Space Details Updated Successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={openPrice}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handlePriceClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Price Details Updated Successfully
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ParkingOwnerProfile;
