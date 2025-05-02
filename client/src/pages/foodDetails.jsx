import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";

function FoodDetails() {
  const id = useParams();
  const [value, setValue] = useState({
    name: "",
    image_link: "",
    description: "",
    rate: "",
    quantity: "",
  });
  const [isItemInCart, setIsItemInCart] = useState(false);

  useEffect(() => {
    async function fetchFood() {
      try {
        const response = await axiosInstance.get(
          `/api/fetch-specific-food/${id.id}`
        );

        setValue(response.data.data);
        fetchCartItem();
      } catch (err) {
        console.error("Error fetching food detail", err);
      }
    }

    async function fetchCartItem() {
      try {
        const cartInfo = await axiosInstance.get(
          `/api/get-specific-cart-item/${id.id}`
        );

        if (cartInfo.data.data) {
          setIsItemInCart(true);
        }
      } catch (err) {
        setIsItemInCart(false);
      }
    }

    if (sessionStorage.getItem(`food-items-${id.id}`)) {
      const data = JSON.parse(sessionStorage.getItem(`food-items-${id.id}`));
      setValue(data.find((obj) => obj.id == id.id));
      fetchCartItem();
    } else {
      fetchFood();
    }
  }, []);

  async function addToCart(id) {
    try {
      const response = await axiosInstance.post("/api/add-to-cart", {
        food_id: id,
        quantity: 1,
      });

      if (response) {
        toast.success(String(response.data.message));
        setIsItemInCart(true);
      }
    } catch (err) {
      toast.error(String(err.message));
    }
  }

  async function removeFromCart(id) {
    try {
      const response = await axiosInstance.delete("/api/delete-item-in-cart", {
        data: {
          food_id: id,
        },
      });

      if (response) {
        toast.success(String(response.data.message));
        setIsItemInCart(false);
      }
    } catch (err) {
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
          <h2>FOOD DETAILS</h2>
          {value.image_link && <img src={value.image_link} loading="lazy" />}
          <h2>{value.name}</h2>
          <p>{value.description}</p>
          <div className="highlight-container">
            <div className="highlight-normal">Quantity: {value.quantity}</div>
            <div className="highlight-normal">Price: {value.rate}</div>
            <div
              className="highlight-normal"
              onClick={() => {
                isItemInCart ? removeFromCart(value.id) : addToCart(value.id);
              }}
            >
              {isItemInCart ? "Remove from cart" : "Add to cart"}
            </div>
            <div className="highlight-unique">Buy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
