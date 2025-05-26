import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute=()=>{
    const isAuthenticated=!!localStorage.getItem('token') || !! Cookies.get("jwt")
    return isAuthenticated ? <Outlet/> :<Navigate to="/" replace></Navigate>
}
export default PrivateRoute;