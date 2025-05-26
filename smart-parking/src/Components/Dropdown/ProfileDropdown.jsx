import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";  // Icon for logout
import PersonIcon from "@mui/icons-material/Person";  // Icon for profile
import { Logout } from "../../Store/UserSlice/UserSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { NavLink, useNavigate } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Accordion expand icon

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    handleClose()
    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        Cookies.remove('jwt', { path: '', domain: '' });
        Swal.fire(
          'Logged Out!',
          'You have been logged out successfully.',
          'success'
        ).then(() => {
          dispatch(Logout());
          navigate('/');
        });
      }
    });
  };

  return (
    <div>
      {/* Accordion for small screens */}
      <div className="sm:hidden">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="h6">Profile</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col items-center">
              <NavLink to="/dashboard/UserProfile" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 w-full">
                <PersonIcon className="mr-2" /> Profile
              </NavLink>
              <NavLink to="#" onClick={logout} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 w-full">
                <ExitToAppIcon className="mr-2" /> Logout
              </NavLink>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Dropdown for large screens */}
      <div className="hidden sm:inline-block">
        <IconButton onClick={handleClick} color="inherit">
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleClose} component={NavLink} to="/dashboard/UserProfile">
            <PersonIcon className="mr-2" />
            Profile
          </MenuItem>
          <MenuItem onClick={logout}>
            <ExitToAppIcon className="mr-2" />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ProfileDropdown;
