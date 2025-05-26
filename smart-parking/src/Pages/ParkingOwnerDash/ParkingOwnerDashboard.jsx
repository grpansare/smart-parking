import React from "react";
import ParkingOwnerSidebar from "../../Components/ParkingOwnerSidebar/SideBar";
import OwnerNavbar from "./OwnerNavbar";

// import BookingHistory from './BookingHistory';
// import PaymentHistory from './PaymentHistory';
// import Notifications from './Notifications';
import styles from "./ParkingOwnerDashboard.module.css";
import SlotManagement from "../../Components/SlotManagement/SlotManagement";
import { Outlet } from "react-router-dom";

const ParkingOwnerDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <ParkingOwnerSidebar />
      <div className={styles.mainContent}>
        <OwnerNavbar />
        <Outlet/>
        {/* <BookingHistory />
        <PaymentHistory />
        <Notifications />  */}
      </div>
    </div>
  );
};

export default ParkingOwnerDashboard;
