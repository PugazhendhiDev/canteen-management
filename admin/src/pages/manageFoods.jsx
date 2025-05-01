import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";

function ManageFoods() {
  const [value, setValue] = useState([]);

  useEffect(() => {
    async function fetchCatagory() {
      try {
        const response = await axiosInstance.get("/api/fetch-catagories");

        if (response) {
          setValue(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          );

          sessionStorage.setItem(
            "catagories",
            JSON.stringify(
              Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data]
            )
          );
        }
      } catch (err) {
        toast.error(err.response);
      }
    }

    if (sessionStorage.getItem("catagories")) {
      setValue(JSON.parse(sessionStorage.getItem("catagories")));
    } else {
      fetchCatagory();
    }
  }, []);

  return (
    <div className="page-wrapper">
      <ToastContainer />
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
          <Link className="link margin-bottom-20" to="/create-catagory">
            Create catagory
          </Link>
          <div className="page-card-container margin-bottom-20">
            {value.map((value, index) => (
              <div className="page-card-wrapper" key={index}>
                <Link className="page-card" to={`/food-management/${value.id}`}>
                  <img src={value.image_link} loading="lazy" />
                  <p>
                    {value.catagory.length > 20
                      ? `${value.catagory.slice(0, 20)}...`
                      : value.catagory}
                  </p>
                </Link>
                <Link
                  className="link margin-top-20"
                  to={`/edit-catagory/${value.id}`}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageFoods;
