import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";

function OrderPage() {
  const [value, setValue] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function fetchOrderHistory() {
      try {
        const response = await axiosInstance.get(`/api/get-user-order/${id}`);

        if (response?.data?.data) {
          setValue(response.data.data);
        }
      } catch (err) {
        toast.error("Failed to fetch order history");
      }
    }

    fetchOrderHistory();
  }, []);

  async function handleDeliver(orderId) {
    try {
      const res = await axiosInstance.put("/api/update-delivery-status", {
        id: orderId,
      });

      setValue((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      toast.success("Order delivered");
    } catch (err) {
      toast.error("Failed to update delivery status");
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
          <h2>Order History</h2>
          <div className="text-center">
            {[...value].reverse().map((order, index) => (
              <div key={index}>
                <h3>Order #{value.length - index}</h3>
                <ul>
                  {order.food.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.quantity} - ₹
                      {item.quantity * item.rate}
                    </li>
                  ))}
                </ul>
                <div className="btn">
                  <button
                    className="delivery-btn"
                    onClick={() => handleDeliver(order.id)}
                  >
                    Deliver
                  </button>
                </div>
                <hr></hr>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
