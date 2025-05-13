import React from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import AccountCreationIcon from "../assets/card/accountCreationIcon";
import AccountManagementIcon from "../assets/card/accountManagementIcon";
import FoodManagementIcon from "../assets/card/foodManagementIcon";
import UserQrScannerIcon from "../assets/card/userQrScannerIcon";

function Home() {
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
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>ADMIN</h2>
          <div className="page-card-container">
            <Link className="page-card" to="/account-creation">
              <div className="page-card-img">
                <AccountCreationIcon />
              </div>
              <p>Account Creation</p>
            </Link>
            <Link className="page-card" to="/account-management">
              <div className="page-card-img">
                <AccountManagementIcon />
              </div>
              <p>Account Management</p>
            </Link>

            <Link className="page-card" to="/category-management">
              <div className="page-card-img">
                <FoodManagementIcon />
              </div>
              <p>Food Management</p>
            </Link>

            <Link className="page-card" to="/user-qr-scanner">
              <div className="page-card-img">
                <UserQrScannerIcon />
              </div>
              <p>User Qr Scanner</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
