import React, { useState } from "react";
import "./LoginPage.css";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import axios from "axios";
import { BsFacebook } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Store/UserSlice/UserSlice";

const LoginPage = () => {
  const URL = "http://localhost:8081/user/login";
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const googleLogin = () => {
    window.location.href =
      "http://localhost:8081/oauth2/authorization/google?prompt=select_account";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(URL, formData);
      console.log(res);

      if (res.status === 200) {
        const user = {
          username: res.data.username,
          email: res.data.email,
          contact: res.data.contact,
          fullname: res.data.fullname,
        };
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(user));
        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back! Redirecting to your dashboard...",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          title: "Login Failed!",
          text: res.data.message || "Invalid credentials, please try again.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (err) {
      console.log(err);

      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };
  return (
    <div className="main-div">
      <div className="background-container border">
        <div className="login-form-container">
          <h2 className="user-heading">User Login</h2>
          <p className="mb-3">
            Doesn't have an account yet?{" "}
            <NavLink to="/userregister" className="signup-link">
              SignUp
            </NavLink>
          </p>

          <form action="#" method="post" onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                name="email"
                className="inputbox"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label for="password">
                Password{" "}
                <NavLink to="/forgetpassword" className="forgot-password">
                  Forgot password?
                </NavLink>
              </label>
              <div className="password-container">
                <input
                  type="password"
                  id="password"
                  onChange={handleChange}
                  className="inputbox"
                  name="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

           

            <div className="d-grid gap-2 ">
              <button className="btn btn-custom submitbtn" type="submit">
                <b>Submit</b>
              </button>
            </div>
          </form>

          <div className="social-buttons">
            <button
              type="button"
              onClick={googleLogin}
              className="flex items-center justify-center gap-2 *
                    border border-green-500 text-green-500 bg-transparent hover:bg-green-500
                     hover:text-white font-medium py-2 px-4 rounded transition w-full"
            >
              <FcGoogle />
              <span>Google</span>
            </button>
            {/* <button
              type="button"
              className=" flex items-center justify-center gap-2 border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white font-medium py-2 px-4 rounded transition w-1/2"
            >
              <BsFacebook />
              <b>Facebook</b>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
