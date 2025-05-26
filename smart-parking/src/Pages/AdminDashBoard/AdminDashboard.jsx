import { useState } from "react";

import AdminNav from "../../Components/Navbar/AdminNav";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {



  

  return (
    <div className="">
        <AdminNav/>
     
      
   <Outlet/>
    </div>
  );
}
