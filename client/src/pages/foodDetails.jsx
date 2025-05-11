import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";

function FoodDetails() {
  const id = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState({
    name: "",
    image_link: "",
    description: "",
    rate: "",
    quantity: "",
  });
  const [isItemInCart, setIsItemInCart] = useState(false);

  const socket = io(import.meta.env.VITE_BACKEND_URL);
  useEffect(() => {
    socket.on("food_quantity_update", (payload) => {
      if (sessionStorage.getItem(`food-items-${id.category_id}`)) {
        const data = JSON.parse(
          sessionStorage.getItem(`food-items-${id.category_id}`)
        );
        const updatedItems = data.map((foodItem) =>
          foodItem && foodItem.id === payload.id
            ? { ...foodItem, quantity: payload.quantity }
            : foodItem
        );

        sessionStorage.setItem(
          `food-items-${id.category_id}`,
          JSON.stringify(updatedItems)
        );
      }
      setValue((prev) =>
        prev && prev.id === payload.id
          ? { ...prev, quantity: payload.quantity }
          : prev
      );
    });

    return () => {
      socket.off("food_quantity_update");
    };
  }, []);

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

    if (sessionStorage.getItem(`food-items-${id.category_id}`)) {
      const data = JSON.parse(
        sessionStorage.getItem(`food-items-${id.category_id}`)
      );
      const item = data.find((obj) => obj.id == id.id);

      async function fetchQuantity() {
        try {
          const response = await axiosInstance.get(
            `/api/get-quantity-of-specific-food/${id.id}`
          );
          const quantity = response.data.data.quantity;

          item.quantity = quantity;

          setValue(item);

          const updatedItems = data.map((foodItem) =>
            foodItem.id === id.id
              ? { ...foodItem, quantity: item.quantity }
              : foodItem
          );

          sessionStorage.setItem(
            `food-items-${id.category_id}`,
            JSON.stringify(updatedItems)
          );
        } catch (err) {
          console.error("Error fetching quantity", err);
        }
      }

      fetchQuantity();
    } else {
      fetchFood();
    }
  }, []);

  async function addToCart(id, category_id) {
    try {
      const response = await axiosInstance.post("/api/add-to-cart", {
        food_id: id,
        category_id: category_id,
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

  function handleBuying() {
    navigate("/buying", {
      state: [
        {
          name: value.name,
          image_link: value.image_link,
          rate: value.rate,
          quantity: 1,
          id: value.id,
        },
        { fromCart: false },
      ],
    });
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
          {value.image_link && (
            <img
              className="page-card-img"
              src={value.image_link}
              loading="lazy"
            />
          )}
          <h2>{value.name}</h2>
          <p>{value.description}</p>
          <div className="highlight-container">
            {value.quantity && (
              <div className="highlight-normal">
                Available: {value.quantity}
              </div>
            )}
            <div className="highlight-normal">Price: {value.rate}</div>
            <div
              className="highlight-normal cursor-pointer"
              onClick={() => {
                isItemInCart
                  ? removeFromCart(value.id)
                  : addToCart(value.id, value.category_id);
              }}
            >
              {isItemInCart ? "Remove from cart" : "Add to cart"}
            </div>
            <div
              className="highlight-unique cursor-pointer"
              onClick={handleBuying}
            >
              Buy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
