import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function CreateCatagory() {
  const [value, setValue] = useState({
    catagory: "",
    image_link: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleCatagoryCreation = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      const response = await axiosInstance.post("/api/admin/create-catagory", {
        catagory: value.catagory,
        image_link: value.image_link,
      });

      if (response) {
        setIsSubmit(true);
        sessionStorage.removeItem("catagories");
        navigate(-1);
      } else {
        setIsSubmit(false);
        setValue({
          catagory: "",
          image_link: "",
        });
      }
    } catch (err) {
      toast.error(String(err.response.data.message));
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
          <form className="form-container" onSubmit={handleCatagoryCreation}>
            <h2>ADMIN</h2>
            <div className="form-header">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="form-body">
              <input
                className="form-input"
                placeholder="Catagory name"
                type="text"
                name="catagory"
                value={value.catagory}
                onChange={(e) =>
                  setValue({
                    ...value,
                    catagory: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Image link"
                type="text"
                name="image_link"
                value={value.image_link}
                onChange={(e) =>
                  setValue({
                    ...value,
                    image_link: e.target.value,
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
                  Create catagory
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCatagory;
