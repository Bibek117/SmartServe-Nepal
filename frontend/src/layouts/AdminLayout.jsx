import { useEffect, useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import adminProfileIamge from "../assets/admin_profile.webp";
import PreLoader from "../components/Preloader";
import axiosClient from "../axios-client";
import "../styles/adminlayout.css";
import {
    FaTachometerAlt,
    FaChartBar,
    FaUserCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";

const AdminLayout = () => {
    const { token, user, settingUser, settingToken , isAdmin , settingIsAdmin} = useStateContext();
    const [initialLoad, setInitialLoad] = useState(true);
    const sideBarLinks = [
        {
            id: 1,
            name: "Dashboard",
            icon: <FaTachometerAlt />,
            link: "/admin/dashboard",
        },
        {
            id: 2,
            name: "Polls",
            icon: <FaChartBar />,
            link: "/admin/polls",
        },
        // {
        //     id: 3,
        //     name: "Policy Feedbacks",
        //     icon: <VscFeedback />,
        //     link: "/admin/policy_feedbacks",
        // },
    ];
   useEffect(() => {
       axiosClient
           .get("/verify_admin")
           .then((response) => {
               settingIsAdmin(response.data.is_admin);
           })
           .catch((error) => {
               settingIsAdmin(false); 
           })
           .finally(() => {
               setInitialLoad(false);
           });
   }, []);

 if (initialLoad) {
         return <PreLoader text="Authenticating! please wait" />;
     } else if (!isAdmin || !token) {
         return <Navigate to="/guest/login" />;
     } else if (user && user.type !== "admin" && !isAdmin) {
         return <Navigate to="/home" />;
     }

    const handleLogout = (e) => {
        e.preventDefault();
        axiosClient.post("/logout").then(() => {
            settingUser(null);
            settingToken(null);
           settingIsAdmin(true);
        });
    };

    return (
        <>
            <div className="dashboard">
                <div className="sidebar">
                    <h3>Admin Dashboard</h3>
                    <ul>
                        {sideBarLinks.map((element) => {
                            return (
                                <li key={element.id}>
                                    <NavLink
                                        // key={element.id}
                                        to={element.link}
                                        className={({ isActive }) =>
                                            isActive ? "active_navlink" : ""
                                        }
                                    >
                                        {element.icon}
                                        {element.name}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="dashboard_content">
                    <div className="navbar">
                        <div className="profile">
                            <img
                                src={adminProfileIamge}
                                alt="Profile Picture"
                            />
                            <span>Bibek Angdembe</span>
                        </div>

                        <div className="admin_handle">
                            <button href="#">
                                <FaUserCog />
                            </button>
                            <button onClick={handleLogout}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>
                    <div className="dashboard_main_content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminLayout;
