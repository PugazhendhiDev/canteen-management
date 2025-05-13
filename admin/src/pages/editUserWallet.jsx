import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function EditUserWallet() {
  const id = useParams();
  const [value, setValue] = useState({
    amount: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      const response = await axiosInstance.put(
        "/api/admin/update-user-wallet",
        {
          roll_no: id.id,
          amount: value.amount,
        }
      );

      if (response) {
        setIsSubmit(true);
        navigate(-1);
      } else {
        setIsSubmit(false);
        setValue({
          amount: "",
        });
      }
    } catch (err) {
      toast.error(String(err.message));
      setIsSubmit(false);
    }
  };

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
          <ToastContainer />
          {value ? (
            <form className="form-container" onSubmit={handleSubmit}>
              <h2>ADMIN</h2>
              <div className="form-header">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="form-body">
                <input
                  className="form-input"
                  placeholder="Enter an amount"
                  type="text"
                  name="amount"
                  value={value.amount}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      amount: e.target.value,
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
                    Submit
                  </button>
                )}
              </div>
            </form>
          ) : (
            <>
              <h2>ADMIN</h2>
              <h2>Not found</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditUserWallet;
