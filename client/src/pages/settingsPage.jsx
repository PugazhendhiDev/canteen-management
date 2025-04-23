import React, { useState } from "react";
import axiosInstance from "../configuration/axios";
import { auth } from "../configuration/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import "./pages.css";
import Logo from "../assets/logo.jpeg";

function SettingsPage() {
  const [isSubmit, setIsSubmit] = useState(false);

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const navigate = useNavigate();

  async function handleLogout() {
    setIsSubmit(true);

    try {
      const response = await axiosInstance.get("/api/logout");

      if (response) {
        await signOut(auth)
          .then(() => {
            localStorage.clear();
            setIsSubmit(false);
            navigate("/");
          })
          .catch((err) => {
            setIsSubmit(false);
            toast.error(String(err.message));
          });
      }
    } catch (err) {
      setIsSubmit(false);
      toast.error(String(err.message));
    }
  }

  return (
    <div className="page-wrapper">
      <ToastContainer />
      <div className="page-header">
        <div className="page-app-details">
          <div className="page-app-logo">
            <img src={Logo} />
          </div>
          <h2 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h2>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>Settings Page</h2>
          {isSubmit ? (
            <button className="form-button" type="submit" disabled>
              <PulseLoader size={5} color={loaderColor} />
            </button>
          ) : (
            <button
              className="form-button"
              type="submit"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
