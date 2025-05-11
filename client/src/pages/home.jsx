import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import CartIcon from "../assets/cards/cartIcon";
import HistoryIcon from "../assets/cards/historyIcon";

function Home() {
  const [value, setValue] = useState([]);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosInstance.get("/api/fetch-categories");

        if (response) {
          setValue(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          );

          sessionStorage.setItem(
            "categories",
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

    if (sessionStorage.getItem("categories")) {
      setValue(JSON.parse(sessionStorage.getItem("categories")));
    } else {
      fetchCategory();
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
          <div className="page-card-container">
            <Link className="page-card" to="/cart">
              <div className="page-card-img">
                <CartIcon />
              </div>
              <p>Cart</p>
            </Link>
            <Link className="page-card" to="/order-history">
              <div className="page-card-img">
                <HistoryIcon />
              </div>
              <p>Orders</p>
            </Link>
          </div>
          <h2>CATEGORY</h2>
          <div className="page-card-container margin-bottom-20">
            {value.map((value, index) => (
              <div className="page-card-wrapper" key={index}>
                <Link className="page-card" to={`/food-list/${value.id}`}>
                  <img
                    className="page-card-img"
                    src={value.image_link}
                    loading="lazy"
                  />
                  <p>
                    {value.category.length > 20
                      ? `${value.category.slice(0, 20)}...`
                      : value.category}
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

export default Home;
