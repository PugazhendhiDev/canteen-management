import React, { useEffect, useState } from "react";
import axiosInstance from "../configuration/axios";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import SettingsIcon from "../assets/icons/settingsIcon";
import ProfileIcon from "../assets/icons/profileIcon";
import EditIcon from "../assets/icons/editIcon";

function ProfilePage() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get("/api/get-user-details");
          if (response.data.data) {
            const user = response.data.data;
            setUserData(user);

            sessionStorage.setItem("userData", JSON.stringify(user));
          } else {
            setUserData({});
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      };

      fetchUser();
    }
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-app-details">
          <div className="page-app-logo">
            <img src={Logo} />
          </div>
          <h2 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h2>
        </div>
        <div className="page-app-profile">
          <Link to="/settings">
            <SettingsIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <div className="page-profile">
            <ProfileIcon />
          </div>
          <Link className="icon" to="/edit-profile">
            <EditIcon />
          </Link>
          <h2>{userData.name || "Name"}</h2>
          <h2>₹{userData.amount || "Amount"}</h2>
          <p>{userData.roll_no || "Roll no"}</p>
          <p>Department: {userData.dept || "Department"}</p>
          <p>Section: {userData.section || "Section"}</p>
          <p>Year: {userData.year || "Year"}</p>
          <p>{userData.batch || "Batch"}</p>
          <p>{userData.email || "Email"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
