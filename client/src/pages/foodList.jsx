import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";

function FoodList() {
  const [value, setValue] = useState([]);

  const id = useParams();

  useEffect(() => {
    async function fetchFoodItems() {
      try {
        const response = await axiosInstance.get(`/api/fetch-foods/${id.id}`);

        if (response) {
          setValue(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          );
        }

        sessionStorage.setItem(
          `food-items-${id.id}`,
          JSON.stringify(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          )
        );
      } catch (err) {
        toast.error(err.response);
      }
    }

    if (sessionStorage.getItem(`food-items-${id.id}`)) {
      setValue(JSON.parse(sessionStorage.getItem(`food-items-${id.id}`)));
    } else {
      fetchFoodItems();
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
          <h2>FOOD ITEMS</h2>
          <div className="page-card-container">
            {value.map((value, index) => (
              <div className="page-card-wrapper" key={index}>
                <Link
                  className="page-card"
                  to={`/food-details/${id.id}/${value.id}`}
                >
                  <img
                    className="page-card-img"
                    src={value.image_link}
                    loading="lazy"
                  />
                  <div className="page-minimal-info">
                    <p className="page-rate">Price: {value.rate}</p>
                    <div
                      className={
                        value.quantity > 0
                          ? "page-quantity-available"
                          : "page-quantity-not-available"
                      }
                    ></div>
                  </div>
                  <p>
                    {value.name.length > 20
                      ? `${value.name.slice(0, 20)}...`
                      : value.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodList;
