import React, { useState } from 'react';
import axios from 'axios';
import "../ParkingOwnerProfile.css";
import '../../ChangePassword/ChangePassword.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { FaKey } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ChangePassword = ({
    onClose
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 const {currentUser}=useSelector((state)=>state.user)
 const email=currentUser.email
  const navigate=useNavigate()

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      // Send request to the backend to update the password
      const response = await axios.post('http://localhost:8081/user/changepassword', {
        password,email:email
      });
       Swal.fire('Success', 'Password Updatef successfully!', 'success').then(() => {
                       
                    });
      setSuccess(response.data || 'Password changed successfully!');
       onClose()

    } catch (err) {
      console.log(err);
      setError(
        err.response && err.response.data
          ? err.response.data
          : 'Something went wrong!'
      );
    }
  };


  const handleBlur = (e) => {
    const { name, value } = e.target;
   

};

  return (
    <div className="modal-overlay">
         <div className="modal-content">
      <h2 className='text-center'>Change Password</h2>
      <form onSubmit={handleSubmit} className='p-4'>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom:2,width:"100%" }}>
          <FaKey size={20} className="text-gray-500 relative top-1" />
          <FormControl sx={{  width: '40ch' }} variant="standard" >
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            onBlur={handleBlur}
            value={password || ""} // Ensure formData.password is never undefined
            onChange={(e)=>{setPassword(e.target.value)}}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
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
          
        
 
        </FormControl>
      
        </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 ,marginBottom:3,width:"100%"}}>
          <FaKey size={20} className="text-gray-500 relative top-1" />
          <FormControl sx={{  width: '40ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
          <Input
             name="confirmPassword"
             onBlur={handleBlur}
             value={confirmPassword || ""} // Ensure formData.password is never undefined
             onChange={(e)=>{setConfirmPassword(e.target.value)}}
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
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
           
     
   
        </FormControl>
      
        </Box>
        <button type="submit" className="btn-submit">
          Update Password
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
    </div>
  );
};

export default ChangePassword;
