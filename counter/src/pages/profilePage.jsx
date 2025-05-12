import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import SettingsIcon from "../assets/icons/settingsIcon";
import ProfileIcon from "../assets/icons/profileIcon";

function ProfilePage(email) {

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-app-details">
          <div className="page-app-logo">
            <img src={Logo} />
          </div>
          <h1 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h1>
        </div>
        <div className="page-app-profile">
          <Link to="/settings">
            <SettingsIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>Counter</h2>
          <div className="page-profile">
            <ProfileIcon />
          </div>
          <p>{email.email || "Email"}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
