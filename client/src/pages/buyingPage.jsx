import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

function BuyingPage() {
  const [displayItems, setDisplayItems] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [flag, setFlag] = useState(true);
  const [buy, setBuy] = useState(false);

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      setFlag(false);
      toast.error("Invalid access to buying page", {
        onClose: () => {
          navigate("/");
        },
      });
      return;
    }

    const [data, { fromCart }] = location.state;

    let totalPrice = 0;
    let totalQuantity = 0;
    let items = [];

    if (fromCart) {
      items = data.map((item) => {
        totalPrice += item.food_list.rate * item.quantity;
        totalQuantity += item.quantity;
        return {
          image_link: item.food_list.image_link,
          name: item.food_list.name,
          rate: item.food_list.rate,
          quantity: item.quantity,
          id: item.food_list.id,
        };
      });
    } else {
      items = [
        {
          image_link: data.image_link,
          name: data.name,
          rate: data.rate,
          quantity: data.quantity,
          id: data.id,
        },
      ];
      totalPrice = data.rate;
      totalQuantity = data.quantity;
    }

    setDisplayItems(items);
    setPrice(totalPrice);
    setQuantity(totalQuantity);
  }, [location.state]);

  const handleOrder = async () => {
    setBuy(true);
    try {
      const res = await axiosInstance.post("/api/order", {
        displayItems,
      });
      if (res) {
        toast.success(String(res.data.message), {
          onClose: () => {
            navigate(-1, { replace: true });
          },
        });
      }
      setBuy(false);
    } catch (err) {
      setBuy(false);
      toast.error("Failed to place order");
      console.error(err);
    }
  };

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
          <h2>Buy</h2>
          <div className="page-card-container">
            {displayItems.map((item, index) => (
              <div className="page-card-wrapper" key={index}>
                <div className="page-card">
                  <img
                    className="page-card-img"
                    src={item.image_link}
                    loading="lazy"
                  />
                  <p>
                    {item.name.length > 20
                      ? `${item.name.slice(0, 20)}...`
                      : item.name}
                  </p>
                </div>
              </div>
            ))}
            {flag && (
              <div className="highlight-container">
                <div className="highlight-normal">Quantity: {quantity}</div>
                <div className="highlight-normal">Price: {price}</div>
                {buy === true ? (
                  <div className="highlight-unique cursor-pointer">
                    <PulseLoader
                      size={5}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                      color={loaderColor}
                    />
                  </div>
                ) : (
                  <div
                    className="highlight-unique cursor-pointer"
                    onClick={handleOrder}
                  >
                    Buy
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyingPage;
