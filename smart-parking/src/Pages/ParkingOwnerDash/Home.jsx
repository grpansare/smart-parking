import React, { useEffect, useState } from 'react'
import SlotManagement from '../../Components/SlotManagement/SlotManagement'
import styles from "./ParkingOwnerDashboard.module.css";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { setOwnerDetails } from '../../Store/UserSlice/UserSlice';
import axios from 'axios';
import { toast } from "react-toastify";
import { Alert, Snackbar } from '@mui/material';


const Home = () => {
  const {currentUser}=useSelector((state)=>state.user)
  const [userDetails,setUserDetails]=useState()
  const dispatch=useDispatch()
  const [availableSlots,setAvailableSlots]=useState()
   const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      getOwnerProfile();
    },[]);
    useEffect(() => {
      if (userDetails) {
        calculateAvailableSlots();
      }
    }, [userDetails]);
    const countAvailableSlots = (slots) =>
      slots.filter((slot) => slot.available).length;
    
    const addnewslot = async () => {
      let token = Cookies.get("jwt") || localStorage.getItem("token");
      console.log(token);
    
      try {
        const response = await axios.get(
          `http://localhost:8081/parkingowner/addnewslot/${userDetails?.parkingSpaces[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
    
        // Wait for profile to update, then recalculate
        const updatedProfile = await axios.get(
          `http://localhost:8081/parkingowner/${currentUser.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        setUserDetails(updatedProfile.data);
        dispatch(setOwnerDetails(updatedProfile.data));
    
        // Now that userDetails is updated, recalculate
        const updatedSlots = updatedProfile.data.parkingSpaces[0].parkingSlot;
        const available = updatedSlots.filter(slot => slot.available).length;
        setAvailableSlots(countAvailableSlots(updatedSlots));
        handleOpen()
    
       
      } catch (err) {
        console.log(err);
        alert("Failed to add slot.");
       
      }
    };
    
    const getOwnerProfile = async () => {
      let token = Cookies.get("jwt") || localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8081/parkingowner/${currentUser.email}`,
  
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUserDetails(response.data);
      
        dispatch(setOwnerDetails(response.data))
      } catch (err) {}
    };
    
    const calculateAvailableSlots=()=>{
      let availableSlots=0
     
      userDetails.parkingSpaces[0].parkingSlot?.map((slot)=>{
        if(slot.available){
          availableSlots+=1
        }
      })
      console.log(availableSlots);
      
      setAvailableSlots(countAvailableSlots(userDetails.parkingSpaces[0].parkingSlot))
    }
  return (
    <div> <div className={styles.dashboardOverview}>
    <div className={styles.overviewCards}>
      {[
        { title: "Total Slots", value:userDetails?.parkingSpaces[0].totalSlots },
        { title: "Available Slots", value: availableSlots },
        { title: "Occupied Slots", value:userDetails?.parkingSpaces[0].totalSlots-availableSlots  },
        { title: "Total Revenue", value: userDetails?.totalEarning },
      ].map((item, index) => (
        <div key={index} className={styles.overviewCard}>
          <h3>{item.title}</h3>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  </div>
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
            Slot added Successfully
          </Alert>
        </Snackbar>

  <SlotManagement addnewslot={addnewslot} /></div>
  )
}

export default Home