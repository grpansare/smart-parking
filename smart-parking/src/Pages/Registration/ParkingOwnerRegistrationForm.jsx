import React, { useState } from "react";
import "./ParkingOwnerRegistrationForm.css";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Form } from "react-bootstrap";
import AddressField from "../../Components/AddressField/AddressField";
import Swal from "sweetalert2";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useNavigate } from "react-router-dom";
import ParkingImageUpload from "../../Components/ParkingImageUpload/ParkingImageUpload";

function ParkingOwnerRegistrationForm() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contactno: "",
    password: "",
    confirmPassword: "",
    lotName: "",
    address: "",
    totalSlots: "",
    numberOfFloors: "",
    parkingImage: "",
    pricingPerHour: "",
    availableFrom: dayjs(),
    availableTo: dayjs(),

    businessRegCert: "",
    identityProof: "",
    lotImage: null,
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
    acceptedTerms: false,
  });
  const [loading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    contactno: "",
    password: "",
    confirmPassword: "",
    lotName: "",
    address: "",

    totalSlots: "",

    pricingPerHour: "",
    availableTimings: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    acceptedTerms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,

      bankDetails: {
        ...prevData.bankDetails,
        [name]: value,
      },
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const handleSubmit = async () => {
    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      contactno: formData.contactno,
      password: formData.password,
      acceptedTerms: formData.acceptedTerms,
      parkingSpaces: [
        {
          lotName: formData.lotName,
          address: formData.address,
          totalSlots: parseInt(formData.totalSlots),
          numberOfFloors: parseInt(formData.numberOfFloors),
          availableFrom: dayjs(formData.availableFrom).format("HH:mm:ss"),
          availableTo: dayjs(formData.availableTo).format("HH:mm:ss"),
          pricingPerHour: parseFloat(formData.pricingPerHour),
        },
      ],
      bankDetails: {
        accountHolderName: formData.bankDetails.accountHolderName,
        bankName: formData.bankDetails.bankName,
        ifscCode: formData.bankDetails.ifscCode,
        accountNumber: formData.bankDetails.accountNumber,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/parkingowner",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const savedOwnerId = response.data.userId; // make sure your backend returns this!

      if (formData.profileImage) {
        await uploadProfileImage(savedOwnerId, formData.profileImage);
      }

      Swal.fire( {icon: 'success',
        title: 'Registration Successful!',
        text: 'Your parking facility has been registered. Please check your email for approval details.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4A90E2'}).then(() => {
        navigate("/ParkingSpaceOwnerLogin");
      });
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const uploadProfileImage = async (userId, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    await axios.post(
      `http://localhost:8081/parkingowner/${userId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const handleTermsChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      acceptedTerms: e.target.checked,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      acceptedTerms: "",
    }));
  };

  const handleTimeChange = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  const handleNext = () => {
    let validationErrors = {};

    if (step === 1) {
      if (!formData.fullname)
        validationErrors.fullName = "Please enter your full name.";
      if (!formData.email) validationErrors.email = "Please enter your email.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        validationErrors.email = "Please enter a valid email address.";
      if (!formData.contactno)
        validationErrors.contactno = "Please enter your phone number.";
      else if (!/^\d{10}$/.test(formData.contactno))
        validationErrors.contactno = "Phone number must be 10 digits.";
      if (!formData.password)
        validationErrors.password = "Please enter your password.";
      if (!formData.confirmPassword)
        validationErrors.confirmPassword = "Please confirm your password.";
      if (formData.password !== formData.confirmPassword)
        validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (step === 2) {
      if (!formData.lotName)
        validationErrors.lotName = "Please enter parking lot name.";
      if (!formData.address)
        validationErrors.address = "Please enter the parking address.";
      if (!formData.totalSlots)
        validationErrors.totalSlots = "Please enter the total number of slots.";
      else if (!/^\d+$/.test(formData.totalSlots))
        validationErrors.totalSlots = "Total slots must be a valid number.";
      if (!formData.numberOfFloors)
        validationErrors.numberOfFLoors = "Please provide floor details.";
    }

    if (step === 3) {
      if (!formData.pricingPerHour)
        validationErrors.pricingPerHour = "Please enter pricing per hour.";
      else if (!/^\d+$/.test(formData.pricingPerHour))
        validationErrors.pricingPerHour =
          "Pricing per hour must be a valid number.";

      if (!formData.availableFrom || !formData.availableTo) {
        validationErrors.availableTimings =
          "Please select both available from and to timings.";
      }
    }

    if (step === 4) {
      if (!formData.bankDetails.accountHolderName)
        validationErrors.accountHolderName =
          "Please enter account holder name.";
      if (!formData.bankDetails.bankName)
        validationErrors.bankName = "Please enter bank name.";
      if (!formData.bankDetails.accountNumber)
        validationErrors.accountNumber = "Please enter account number.";
      else if (!/^\d+$/.test(formData.bankDetails.accountNumber))
        validationErrors.accountNumber =
          "Account number must be a valid number.";
      if (!formData.bankDetails.ifscCode)
        validationErrors.ifscCode = "Please enter IFSC code.";
      if (!formData.acceptedTerms)
        validationErrors.acceptedTerms =
          "Please accept the terms and conditions.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (step < 4) {
      setStep(step + 1);
      if (step === 4) {
        console.log(step);
      }
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="owner-register">
      <div className="Owner-form-container shadow-2xl">
        <h1 className="mx-auto text-center mb-4 font-bold flex flex-col justify-center items-center">
          <img src="logo.png" alt="ParkEase Logo" className="max-h-10" />
          <p className="text-lg">ParkEase</p>
        </h1>
        <h2 className="text-center text-xl font-mono font-bold  ">
          Parking Owner Registration
        </h2>

        {step === 1 && (
          <div className="section">
            <h3 className="">Personal Information</h3>

            <TextField
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              fullWidth
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
              fullWidth
              name="contactno"
              value={formData.contactno}
              onChange={handleChange}
              error={!!errors.contactno}
              helperText={errors.contactno}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              className="no-border"
            />
          </div>
        )}

        {step === 2 && (
          <div className="section">
            <h3>Parking Space Details</h3>

            <TextField
              id="outlined-basic"
              label="Parking Lot Name"
              variant="outlined"
              fullWidth
              name="lotName"
              value={formData.lotName}
              onChange={handleChange}
              error={!!errors.lotName}
              helperText={errors.lotName}
              className="no-border"
            />
            <ParkingImageUpload
              image={image}
              formData={formData}
              setFormData={setFormData}
            />
            <AddressField
              handleChange={handleChange}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <TextField
              id="outlined-basic"
              label="Total Number of Slots"
              variant="outlined"
              fullWidth
              name="totalSlots"
              value={formData.totalSlots}
              onChange={handleChange}
              error={!!errors.totalSlots}
              helperText={errors.totalSlots}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Number of Floors"
              variant="outlined"
              fullWidth
              name="numberOfFloors"
              value={formData.numberOfFloors}
              onChange={handleChange}
              error={!!errors.numberOfFLoors}
              helperText={errors.numberOfFLoors}
              className="no-border"
            />
          </div>
        )}

        {step === 3 && (
          <div className="section">
            <h3>Pricing & Availability</h3>

            <TextField
              id="outlined-basic"
              label="Pricing Per Hour"
              variant="outlined"
              fullWidth
              name="pricingPerHour"
              value={formData.pricingPerHour}
              onChange={handleChange}
              error={!!errors.pricingPerHour}
              helperText={errors.pricingPerHour}
              className="no-border"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-row gap-4">
                <TimePicker
                  label="Available From"
                  value={formData.availableFrom}
                  onChange={(newValue) =>
                    handleTimeChange(newValue, "availableFrom")
                  }
                  ampm={false}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <TimePicker
                  label="Available To"
                  value={formData.availableTo}
                  onChange={(newValue) =>
                    handleTimeChange(newValue, "availableTo")
                  }
                  ampm={false}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </div>
            </LocalizationProvider>
          </div>
        )}

        {step === 4 && (
          <div className="section">
            <h3>Bank Details</h3>

            <TextField
              id="outlined-basic"
              label="Account Holder Name"
              variant="outlined"
              fullWidth
              name="accountHolderName"
              value={formData.bankDetails.accountHolderName}
              onChange={handleBankChange}
              error={!!errors.accountHolderName}
              helperText={errors.accountHolderName}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Bank Name"
              variant="outlined"
              fullWidth
              name="bankName"
              value={formData.bankName}
              onChange={handleBankChange}
              error={!!errors.bankName}
              helperText={errors.bankName}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="Account Number"
              variant="outlined"
              fullWidth
              name="accountNumber"
              value={formData.bankDetails.accountNumber}
              onChange={handleBankChange}
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
              className="no-border"
            />

            <TextField
              id="outlined-basic"
              label="IFSC Code"
              variant="outlined"
              fullWidth
              name="ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={handleBankChange}
              error={!!errors.ifscCode}
              helperText={errors.ifscCode}
              className="no-border"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptedTerms}
                  onChange={handleTermsChange}
                  name="acceptedTerms"
                  color="primary"
                />
              }
              label="I accept the terms and conditions"
            />
            {errors.acceptedTerms && (
              <p className="error">{errors.acceptedTerms}</p>
            )}
          </div>
        )}

        <div className="navigation-buttons">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-outline-primary btn-small"
              onClick={handlePrev}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-primary btn-small"
            onClick={handleNext}
          >
            {step === 4 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParkingOwnerRegistrationForm;
