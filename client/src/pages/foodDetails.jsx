import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";

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
          `/api/admin/fetch-specific-food/${id.id}`
        );
        setValue(response.data.data);
      } catch (err) {
        console.error("Error fetching food detail", err);
      }
    }

    if (localStorage.getItem("cart")) {
      JSON.parse(localStorage.getItem("cart")).find((obj) => obj.id == id.id)
        ? setIsItemInCart(true)
        : setIsItemInCart(false);
    }

    if (sessionStorage.getItem(`food-items-${id.id}`)) {
      const data = JSON.parse(sessionStorage.getItem(`food-items-${id.id}`));
      setValue(data.find((obj) => obj.id == id.id));
    } else {
      fetchFood();
    }
  }, []);

  function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    setIsItemInCart(true);
  }

  function removeFromCart(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== id.id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsItemInCart(false);
  }

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
                isItemInCart
                  ? removeFromCart({ id: value.id })
                  : addToCart({ id: value.id });
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
