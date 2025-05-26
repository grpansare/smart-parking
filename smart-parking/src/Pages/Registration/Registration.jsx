import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { FaEnvelope, FaPhone, FaUser, FaKey } from "react-icons/fa";
import "./Registration.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginWithGoogle from "../../Components/LoginWithGoogle/LoginWithGoogle";
import { AuthContext } from "../../Utils/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import Select from "@mui/material/Select";

const Registration = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { token, setToken } = useContext(AuthContext);
  const [loading, setisLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const URL = "http://localhost:8081/user/register";

  const navigate = useNavigate();
  const handleBlur = (e) => {
    const { name, value } = e.target;

    validateField(name, value);
  };

  const validators = {
    fullname: (value) => {
      if (!value || value.trim() === "") {
        return "Full name is required.";
      }
      return /^[A-Z]/.test(value)
        ? ""
        : "Full name should start with a capital letter.";
    },
    email: (value) => {
      if (!value || value.trim() === "") {
        return "Email is required.";
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Invalid email format.";
    },
    contactno: (value) => {
      if (!value || value.trim() === "") {
        return "Phone number is required.";
      }
      return /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(value)
        ? ""
        : "Invalid phone number.";
    },
    vehicleType: (value) => {
      if (!value || value.trim() === "") {
        return "Vehicle Type is required.";
      }
    },
    password: (value) => {
      if (!value || value.trim() === "") {
        return "Password is required.";
      }
      return value.length >= 8
        ? ""
        : "Password must be at least 8 characters long.";
    },
    cpassword: (value, password) => {
      if (!value || value.trim() === "") {
        return "Confirm password is required.";
      }
      return value === password ? "" : "Passwords do not match.";
    },
  };

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contactno: "",

    password: "",
    cpassword: "",
    vehicleType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };
  const isFormValid = () => {
    return (
      Object.values(errors).every((err) => !err) && // No validation errors
      formData.fullname.trim() &&
      formData.email.trim() &&
      formData.contactno.trim() &&
      formData.vehicleType.trim() &&
      formData.password.trim() &&
      formData.cpassword.trim() &&
      formData.password === formData.cpassword // Confirm password matches
    );
  };

  const validateField = (name, value) => {
    const errorMsg = validators[name]
      ? validators[name](value, formData.password)
      : "";

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setisLoading(true);
    const isValid =
      Object.values(errors).every((err) => !err) &&
      Object.values(formData).every((field) => field.trim());

    if (!isValid) {
      Swal.fire("Error", "Please fix all errors before submitting.", "error");
      return;
    }

    try {
      const res = await axios.post(URL, formData);
      console.log(res);

      if (res.status === 201) {
        Swal.fire("Success", "Registered successfully!", "success").then(() => {
          navigate("/login");
        });
        setisLoading(false);
      }
    } catch (err) {
      console.log(err);
      setisLoading(false);

      if (err.response?.status === 409) {
        Swal.fire(
          "Error",
          "Email already exists. Please use a different email.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Something went wrong.",
          "error"
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full border px-4 bg-gray-100">
      <div className="register-box border w-full max-w-4xl sm:w-2/3 md:w-1/2 lg:w-2/3 p-7 bg-white shadow-lg rounded-lg">
        {/* Logo Section */}
        <h1 className="mx-auto text-center mb-4 font-bold flex flex-col justify-center items-center">
          <img src="logo.png" alt="ParkEase Logo" className="max-h-10" />
          <p className="text-lg">ParkEase</p>
        </h1>

        {/* Title */}
        <h4 className="font-bold text-center text-2xl mb-4">
          User Registration
        </h4>

        {/* Input Fields */}
        <div className="textfields space-y-4">
          <Box
            component="form"
            className="flex flex-col  gap-4"
            // makes TextField take full width
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-3 w-full ">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaUser size={20} className="text-gray-500 relative top-1 " />
                <TextField
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.fullname}
                  helperText={errors.fullname}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaUser size={20} className="text-gray-500 relative top-1 " />
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 120 }}
                  error={errors.vehicleType}
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-error-label">
                    Vehicle Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    value={formData.vehicleType}
                    label="Vehicle Type"
                    onChange={handleChange}
                    name="vehicleType"
                    renderValue={(value) => `${value}`}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="" color="red">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="two Wheeeler">Two Wheeler</MenuItem>
                    <MenuItem value="Four Wheeler">Four Wheeler</MenuItem>
                  </Select>
                  {!!errors.vehicleType && (
                    <FormHelperText>{errors.vehicleType}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </div>

            <div className="flex gap-5 w-full mt-3">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaEnvelope
                  size={20}
                  className="text-gray-500 relative top-1"
                />
                <TextField
                  label="Email"
                  error={!!errors.email}
                  onBlur={handleBlur}
                  helperText={errors.email}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaPhone size={20} className="text-gray-500 relative top-1" />
                <TextField
                  onBlur={handleBlur}
                  error={!!errors.contactno}
                  helperText={errors.contactno}
                  label="Phone Number"
                  name="contactno"
                  value={formData.contactno}
                  onChange={handleChange}
                  variant="standard"
                  fullWidth
                />
              </Box>
            </div>
            <div className="flex gap-3 w-full mt-3">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaKey size={20} className="text-gray-500 relative top-1" />
                <FormControl
                  sx={{ width: "40ch" }}
                  variant="standard"
                  onChange={handleChange}
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onBlur={handleBlur}
                    value={formData.password || ""} // Ensure formData.password is never undefined
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {!!errors.password && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "50%",
                }}
              >
                <FaKey size={20} className="text-gray-500 relative top-1" />
                <FormControl sx={{ width: "40ch" }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <Input
                    name="cpassword"
                    onBlur={handleBlur}
                    value={formData.cpassword || ""} // Ensure formData.password is never undefined
                    onChange={handleChange}
                    id="standard-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {!!errors.cpassword && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.cpassword}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                disabled={!isFormValid()}
                className="bg-slate-700 relative text-white p-3 mx-auto rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-1/3"
              >
                {loading ? (
                  <ClipLoader
                    color="white"
                    loading={loading}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </Box>
          <div className="mt-4 text-center">
            <p>
              Already have an account?
              <NavLink to="/login" className="text-blue-500 ml-2 font-bold">
                Sign in
              </NavLink>
            </p>
            <p className="mt-2">OR</p>
            <div className="flex justify-center mt-2">
              <LoginWithGoogle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
