import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";

function EmailSent() {
  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>ADMIN</h2>
        <div className="form-header">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="form-body">
          <p className="form-p">After verifing, click the refresh button.</p>
          <Link className="form-button" to="/" replace>
            Refresh the page
          </Link>
        </div>

        <div className="form-footer">
          <p className="Terms-Of-Use-And-Privacy-Policy-p">
            <Link className="form-link" to="/">
              Terms of Use
            </Link>{" "}
            |{" "}
            <Link className="form-link" to="/">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSent;
