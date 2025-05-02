import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";

function Cart() {
  const [value, setValue] = useState([]);

  useEffect(() => {
    async function fetchFoodItems() {
      try {
        const response = await axiosInstance.get("/api/get-cart-items");

        if (response) {
          setValue(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          );
        }
      } catch (err) {
        toast.error(err.response);
      }
    }
    fetchFoodItems();
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
          <h2>CART</h2>
          <div className="page-card-container">
            {value.map((value, index) => (
              <div className="page-card-wrapper" key={index}>
                <Link
                  className="page-card"
                  to={`/food-details/${value.food_list.id}`}
                >
                  <img src={value.food_list.image_link} loading="lazy" />
                  <p>
                    {value.food_list.name.length > 20
                      ? `${value.food_list.name.slice(0, 20)}...`
                      : value.food_list.name}
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

export default Cart;
