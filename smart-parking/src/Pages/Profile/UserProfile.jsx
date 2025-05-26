import React, { useEffect, useRef, useState } from "react";
import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import VehicleInfo from "../../Components/VehicleInfo/VehicleInfo";
import { Logout, setUser } from "../../Store/UserSlice/UserSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeSection, setActiveSection] = useState("Vehicle Information");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    getVehicleInfo();
  }, []);
  const { currentUser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState(currentUser);

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

      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const logout = async () => {
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

  const getVehicleInfo = async () => {
    let token = Cookies.get("jwt");
    console.log(token);
    if (!token) {
      token = localStorage.getItem("token");
    } // ✅ Get Token From LocalStorage
    console.log(token);
    if (token) {
      try {
        const res = await axios.get(
          `http://localhost:8081/user/getvehiclesInfo/${currentUser.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Pass JWT Token in Header
            },
          }
        );

        console.log(res.data);
        setVehicles(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleUpdateInfo = () => {
    setIsModalOpen(true);
   
  };

  const handleLogout = () => {
    console.log("Logged out");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Vehicle Information":
        return (
          <VehicleInfo
            setVehicles={setVehicles}
            vehicles={vehicles}
          ></VehicleInfo>
        );
      case "Notifications & Preferences":
        return (
          <div className="user-Notifications-Preferences-info-container">
            <h3>Notifications & Preferences</h3>
            <div className="user-preferences-container">
              <div className="user-preferences-item">
                <label>Push Notifications:</label>
                <input type="checkbox" className="user-checkbox" />
              </div>
              <div className="user-preferences-item">
                <label>Alerts:</label>
                <input type="checkbox" className="user-checkbox2" />
              </div>
            </div>
            <button className="user-apply-button">Apply</button>
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
            <button className="user-security-button">Change Password</button>
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

  const closeModal = () => setIsModalOpen(false);

  const saveChanges = async () => {
    let token = Cookies.get("jwt");
    console.log(token);
    if (!token) {
      token = localStorage.getItem("token");
    }
    try {
      const res = await axios.patch(
        `http://localhost:8081/user/updateinfo/${currentUser.email}`,
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass JWT Token in Header
          },
        }
      );
      console.log(res.data);
      setUserDetails(res.data)
      dispatch(setUser(userDetails));
    } catch (e) {}

    console.log("Updated Info:", userDetails);
    setIsModalOpen(false);
    // You can call an API or dispatch to store here to save the updated info
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-section">
        <div className="user-profile-left">
          <div className="user-profile-picture flex flex-col  items-center ">
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
        <div className="user-profile-right">
          <label>Name:</label>
          <input
            type="text"
            value={currentUser?.fullname}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="name-input"
          />
          <label>Email:</label>
          <input
            type="email"
            value={currentUser?.email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {currentUser?.contactno && (
            <>
              <label>Phone:</label>

              <input
                type="tel"
                value={currentUser?.contactno}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
              />
            </>
          )}
          <button onClick={handleUpdateInfo}>Update Information</button>
          <button className="logout-button" onClick={logout}>
            Log Out
          </button>
        </div>
      </div>

      <div className="horizontal-navbar">
        <button onClick={() => setActiveSection("Vehicle Information")}>
          Vehicle Information
        </button>
        <button onClick={() => setActiveSection("Notifications & Preferences")}>
          Notifications & Preferences
        </button>
        <button onClick={() => setActiveSection("Security Settings")}>
          Security Settings
        </button>
        <button onClick={() => setActiveSection("Support & Feedback")}>
          Support & Feedback
        </button>
      </div>

      <div className="section-content">{renderSection()}</div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Update Information</h2>
            <label>Name:</label>
            <input
              type="text"
              value={userDetails.fullname}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <label>Email:</label>
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
            <label>Phone:</label>
            <input
              type="tel"
              value={userDetails.contactno}
              onChange={(e) =>
                setUserDetails({ ...userDetails, contactno: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={saveChanges}>Save Changes</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
