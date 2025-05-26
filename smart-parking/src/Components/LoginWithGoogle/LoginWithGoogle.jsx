import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import './LoginWithGoogle.css'

const clientId = "288245503880-dmvcbgm9ffbgaco0pvlhi660g6qsbu9k.apps.googleusercontent.com"; // Replace with your actual Google Client ID

const GoogleLoginButton = ({ setToken }) => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google?prompt=select_account';
  };
  
  return (
   <div>
 <button 
      onClick={googleLogin} 
      className="flex  items-center bg-white hover:bg-slate-100 login-btn gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700  transition"
    >
  <FcGoogle /> Continue with Google
    </button>   </div>
  );
};

export default GoogleLoginButton;
