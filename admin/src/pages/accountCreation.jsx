import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function AccountCreation() {
  const [value, setValue] = useState({
    displayName: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (value.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setIsSubmit(false);
      return;
    } else if (value.password !== value.retypePassword) {
      toast.error("Password don't match.");
      setIsSubmit(false);
      return;
    } else {
      try {
        const response = await axiosInstance.post("/api/admin/create-account", {
          email: value.email,
          password: value.password,
          displayName: value.displayName,
        });

        if (response) {
          setIsSubmit(true);
          navigate("/");
        } else {
          setIsSubmit(false);
          setValue({
            displayName: "",
            email: "",
            password: "",
            retypePassword: "",
          });
        }
      } catch (err) {
        toast.error(String(err.message));
        setIsSubmit(false);
      }
    }
  };

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
          <ToastContainer />
          <form className="form-container" onSubmit={handleAccountCreation}>
            <h2>ADMIN</h2>
            <div className="form-header">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="form-body">
              <input
                className="form-input"
                placeholder="Display name"
                type="text"
                name="text"
                value={value.displayName}
                onChange={(e) =>
                  setValue({
                    ...value,
                    displayName: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Enter your email"
                type="email"
                name="email"
                value={value.email}
                onChange={(e) =>
                  setValue({
                    ...value,
                    email: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={value.password}
                onChange={(e) =>
                  setValue({
                    ...value,
                    password: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Retype password"
                type="password"
                name="password"
                value={value.retypePassword}
                onChange={(e) =>
                  setValue({
                    ...value,
                    retypePassword: e.target.value,
                  })
                }
                required
              />
              {isSubmit ? (
                <button className="form-button" type="submit" disabled>
                  <PulseLoader size={5} color={loaderColor} />
                </button>
              ) : (
                <button className="form-button" type="submit">
                  Create account
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountCreation;
