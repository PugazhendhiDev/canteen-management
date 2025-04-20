import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";

function FoodDetails() {
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
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>Food Details</h2>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
