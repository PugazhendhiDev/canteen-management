import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";

function Cart() {
  const [value, setValue] = useState([]);
  const navigate = useNavigate();

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

  async function handleQuantityUpdate(id, food_id, quantity, updateMethod) {
    try {
      let newQuantity =
        updateMethod === "Increment" ? quantity + 1 : quantity - 1;

      if (newQuantity === 0) {
        setValue((prev) => prev.filter((item) => item.id !== id));

        try {
          const response = await axiosInstance.delete(
            "/api/delete-item-in-cart",
            {
              data: { food_id },
            }
          );
        } catch (err) {
          toast.error("Failed to remove item");
        }

        return;
      }

      setValue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      const response = await axiosInstance.put("/api/update-quantity", {
        id,
        quantity: newQuantity,
        updateMethod,
      });
    } catch (err) {
      toast.error("Error updating cart");
    }
  }

  function handleBuying() {
    navigate("/buying", {
      state: [value, { fromCart: true }],
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
          <h2>CART</h2>
          <div className="page-card-container">
            {value.map((value, index) => (
              <div className="page-card-wrapper" key={index}>
                <Link
                  className="page-card"
                  to={`/food-details/${value.food_categories.id}/${value.food_list.id}`}
                >
                  <img
                    className="page-card-img"
                    src={value.food_list.image_link}
                    loading="lazy"
                  />
                  <p>
                    {value.food_list.name.length > 20
                      ? `${value.food_list.name.slice(0, 20)}...`
                      : value.food_list.name}
                  </p>
                </Link>
                <div className="margin-top-20 flex-col">
                  <button
                    className="cart-quantity-button"
                    onClick={() =>
                      handleQuantityUpdate(
                        value.id,
                        value.food_list.id,
                        value.quantity,
                        "Decrement"
                      )
                    }
                  >
                    -
                  </button>
                  <p>{value.quantity}</p>
                  <button
                    className="cart-quantity-button"
                    onClick={() =>
                      handleQuantityUpdate(
                        value.id,
                        value.food_list.id,
                        value.quantity,
                        "Increment"
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="highlight-container margin-top-20">
            {value.length > 0 ? (
              <div
                className="highlight-unique cursor-pointer"
                onClick={handleBuying}
              >
                Buy
              </div>
            ) : (
              <p>Cart is empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
