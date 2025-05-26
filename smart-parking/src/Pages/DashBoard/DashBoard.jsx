import axios from "axios";
import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);


  const [error, setError] = useState(null);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store Token in LocalStorage or Context API
      localStorage.setItem("authToken", token);

     console.log(token);
     
    }
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8081/user/userinfo", {
          withCredentials: true, // Ensures authentication cookies are sent
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
     <Navbar/>
     <Outlet/>
     <Footer/>
    </div>
  );
};

export default Dashboard;
