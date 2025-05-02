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

    if (sessionStorage.getItem("food_items")) {
      const data = JSON.parse(sessionStorage.getItem("food_items"));
      setValue(data.find((obj) => obj.id == id.id));
    } else {
      fetchFood();
    }
  }, []);

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
          {value ? (
            <>
              <h2>ADMIN</h2>
              {value.image_link && (
                <img src={value.image_link} loading="lazy" />
              )}
              <h2>{value.name}</h2>
              <p>{value.description}</p>
              <div className="highlight-container">
                <div className="highlight-normal">
                  Quantity: {value.quantity}
                </div>
                <div className="highlight-unique">Price: {value.rate}</div>
                <Link className="highlight-normal" to={`/edit-food/${id.id}`}>
                  Edit
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>ADMIN</h2>
              <h2>Not found</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
