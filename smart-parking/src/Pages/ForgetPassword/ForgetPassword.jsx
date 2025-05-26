import React, { useState } from "react";
import axios from "axios";
import styles from "./Forgetpass.module.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { Alert, TextField } from "@mui/material";
import { ClipLoader } from "react-spinners";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 5,
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const navigate = useNavigate();
  const [loading, setisLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOtp("");
    setUserOtp("");
    setOtpError("");
    setOtpSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setUserOtp("");
    setisLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8081/user/send?email=${email}`
      );
      setMessage(response.data.msg);
      setOtp(response.data.otp);
      handleOpen();
    } catch (err) {
      console.log(err);
      setError(
        err.response && err.response.data
          ? err.response.data
          : "Something went wrong!"
      );
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8081/user/verify?otp=${userOtp}`
      );
      console.log(response.data);

      if (response.data) {
        setOtpSuccess("OTP verified successfully!");
        navigate("/changepassword", { state: { email } });
        setOtpError("");
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtpSuccess("");
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response && err.response.data
          ? err.response.data
          : "Something went wrong!"
      );
    }
  };

  return (
    <>
      <div className={styles["forgot-password-container"]}>
        <h1 className="flex flex-col items-center justify-center font-bold ">
          <img src="logo.png" alt="" className="max-h-10" />
          ParkEase
        </h1>
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              id="outlined-basic"
              label="Enter Registered Email Address"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className={"mb-3"}
            />
          </div>
          <button type="submit" className={`styles['btn-submit'] mt-3`}>
           {loading ? (
                             <ClipLoader
                               color="white"
                               loading={loading}
                               size={30}
                               aria-label="Loading Spinner"
                               data-testid="loader"
                             />
                           ) : (
                             "Send Otp"
                           )}
          </button>
        </form>
        {message && (
          <p className={`styles['success-message'] badge`}>{message}</p>
        )}
        {error && <Alert severity="warning">{error}</Alert>}
      </div>

      <Modal
        open={open}
        onClose={handleClose} // Keeps modal close functionality via ESC key or specific triggers
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          onClick: (e) => e.stopPropagation(), // Prevents the modal from closing on backdrop click
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: "400px",
            maxWidth: "90%", // Responsive width
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click events inside Box from propagating
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              background: "black",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
            aria-label="Close modal"
          >
            &times;
          </button>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <section className={styles["wrapper"]}>
              <div className="text-center border-2 border-gray-200 rounded-lg shadow-md p-6">
                <form
                  className="rounded-lg bg-white p-8 shadow-lg max-w-md mx-auto"
                  onSubmit={handleOtpSubmit}
                >
                  <h3 className="text-gray-800 font-bold text-2xl mb-4">
                    Otp Verification
                  </h3>

                  <div className="text-gray-600 mb-6">
                    An OTP has been sent to{" "}
                    <b className="text-gray-800">{email}</b>. Please check your
                    inbox.
                  </div>

                  <div className={`${styles["otp_input"]} mb-5`}>
                    <label
                      htmlFor="userOtp"
                      className="block text-sm font-medium mb-2"
                    >
                      Type your 6-digit security code
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      id="userOtp"
                      placeholder="Enter OTP"
                      value={userOtp}
                      onChange={(e) => setUserOtp(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 my-4"
                  >
                    Verify
                  </button>

                  {otpError && (
                    <p className="text-red-500 text-sm">{otpError}</p>
                  )}
                  {otpSuccess && (
                    <p className="text-green-500 text-sm">{otpSuccess}</p>
                  )}

                  <div className="text-gray-600 mt-4">
                    Didn’t get the code?{" "}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline font-semibold"
                      onClick={handleSubmit}
                    >
                      Resend
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ForgotPassword;
