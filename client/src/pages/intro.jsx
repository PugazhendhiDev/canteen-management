import React from "react";
import Logo from "../assets/logo.jpeg";
import "./pages.css";
import { Link } from "react-router-dom";

function Intro() {
  return (
    <div className="page-wrapper page-wrapper-custom intro-page-animation">
      <div className="page-container page-container-custom">
        <div className="page-body gap-20">
          <div className="page-logo">
            <img src={Logo} />
          </div>
          <div className="page-auth-btn-container">
            <Link className="page-btn" to="/login">
              Login
            </Link>
            <Link className="page-btn" to="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
