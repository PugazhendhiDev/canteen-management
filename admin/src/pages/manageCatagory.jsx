import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";

function ManageCatagory() {
  const [value, setValue] = useState([]);

  useEffect(() => {
    async function fetchCatagory() {
      try {
        const response = await axiosInstance.get("/api/fetch-catagories");

        if (response) {
          setValue(response.data.data);
        }
      } catch (err) {
        toast.error(err.response);
      }
    }

    fetchCatagory();
  }, []);

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
        <div className="page-app-profile">
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>ADMIN</h2>
          <Link className="link margin-bottom-20" to="/create-catagory">
            Create catagory
          </Link>
          <div className="page-card-container">
            {value.map((value, index) => (
              <Link className="page-card" to="/food-details" key={index}>
                <img src={value.image_link} />
                <p>{value.catagory}</p>
                <Link
                  className="link margin-top-20"
                  to={`/edit-catagory/${value.id}`}
                >
                  Edit
                </Link>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCatagory;
