import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

function OrderPage() {
  const [value, setValue] = useState([]);
  const [submit, setSubmit] = useState(null);

  const { id } = useParams();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

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

  async function handleDeliver(orderId, btnId) {
    setSubmit(btnId);
    try {
      const res = await axiosInstance.put("/api/update-delivery-status", {
        id: orderId,
      });

      setValue((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      setSubmit(null);

      if (res) {
        toast.success("Order delivered");
      }
    } catch (err) {
      setSubmit(null);
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
          <h2>Counter</h2>
          <h2>Order History</h2>
          <div className="text-center">
            {value.length === 0 ? (
              <PulseLoader
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <>
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
                      {submit === index ? (
                        <button className="delivery-btn">
                          <PulseLoader
                            size={5}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            color={loaderColor}
                          />
                        </button>
                      ) : (
                        <button
                          className="delivery-btn"
                          onClick={() => handleDeliver(order.id, index)}
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                    <hr></hr>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
