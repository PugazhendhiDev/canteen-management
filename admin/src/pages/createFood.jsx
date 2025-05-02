import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function CreateFood() {
  const id = useParams();
  const [value, setValue] = useState({
    name: "",
    image_link: "",
    description: "",
    rate: "",
    quantity: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handlecategoryCreation = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      const response = await axiosInstance.post("/api/admin/create-food", {
        category_id: id.id,
        name: value.name,
        image_link: value.image_link,
        description: value.description,
        rate: value.rate,
        quantity: value.quantity,
      });

      if (response) {
        setIsSubmit(true);
        sessionStorage.removeItem(`food-items-${id.id}`);
        navigate(-1);
      } else {
        setIsSubmit(false);
        setValue({
          name: "",
          image_link: "",
          description: "",
          rate: "",
          quantity: "",
        });
      }
    } catch (err) {
      toast.error(String(err.response.data.message));
      setIsSubmit(false);
    }
  };

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
          <ToastContainer />
          <form className="form-container" onSubmit={handlecategoryCreation}>
            <h2>ADMIN</h2>
            <div className="form-header">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="form-body">
              <input
                className="form-input"
                placeholder="Name"
                type="text"
                name="name"
                value={value.name}
                onChange={(e) =>
                  setValue({
                    ...value,
                    name: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Image link"
                type="text"
                name="image_link"
                value={value.image_link}
                onChange={(e) =>
                  setValue({
                    ...value,
                    image_link: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Description"
                type="text"
                name="description"
                value={value.description}
                onChange={(e) =>
                  setValue({
                    ...value,
                    description: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Rate"
                type="text"
                name="rate"
                value={value.rate}
                onChange={(e) =>
                  setValue({
                    ...value,
                    rate: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Quantity"
                type="text"
                name="quantity"
                value={value.quantity}
                onChange={(e) =>
                  setValue({
                    ...value,
                    quantity: e.target.value,
                  })
                }
                required
              />
              {isSubmit ? (
                <button className="form-button" type="submit" disabled>
                  <PulseLoader size={5} color={loaderColor} />
                </button>
              ) : (
                <button className="form-button" type="submit">
                  Create food
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateFood;
