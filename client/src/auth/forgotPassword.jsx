import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { auth } from "../configuration/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
      setEmail("");
    } catch (error) {
      toast.error("Error: " + error.message);
    }

    setIsSubmit(false);
  };

  return (
    <div className="form-wrapper">
      <ToastContainer />
      <form className="form-container" onSubmit={handleReset}>
        <div className="form-header">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="form-body">
          <input
            className="form-input"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {isSubmit ? (
            <button className="form-button" type="submit" disabled>
              <PulseLoader size={5} color={loaderColor} />
            </button>
          ) : (
            <button className="form-button" type="submit">
              Send Reset Link
            </button>
          )}
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
      </form>
    </div>
  );
}

export default ForgotPassword;
