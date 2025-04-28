import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import DeleteIcon from "../assets/icons/deleteIcon";

function EditCatagory() {
  const id = useParams();
  const [value, setValue] = useState({
    catagory: "",
    image_link: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      const response = await axiosInstance.put("/api/admin/update-catagory", {
        id: id.id,
        catagory: value.catagory,
        image_link: value.image_link,
      });

      if (response) {
        setIsSubmit(true);
        navigate(-1);
      } else {
        setIsSubmit(false);
        setValue({
          password: "",
          retypePassword: "",
        });
      }
    } catch (err) {
      toast.error(String(err.message));
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    async function fetchCatagory() {
      try {
        const response = await axiosInstance.get(
          `/api/admin/fetch-specific-catagory/${id.id}`
        );
        setValue(response.data.data);
      } catch (err) {
        console.error("Error fetching catagory detail", err);
      }
    }

    fetchCatagory();
  }, []);

  async function handleDelete() {
    setDeleted(true);
    toast("Deleting...");
    try {
      const res = await axiosInstance.delete("/api/admin/delete-catagory", {
        data: { id: id.id },
      });

      if (res) {
        navigate(-1);
      }

      setDeleted(false);
    } catch (err) {
      setDeleted(false);
      toast.error(err.response?.data?.error || "Something went wrong!");
    }
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
          <ToastContainer />
          {value ? (
            <form className="form-container" onSubmit={handleSubmit}>
              <h2>ADMIN</h2>
              <div className="form-header">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="form-body">
                <input
                  className="form-input"
                  placeholder="Catagory name"
                  type="text"
                  name="catagory"
                  value={value.catagory}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      catagory: e.target.value,
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
                <div className="page-center">
                  <div
                    className="page-btn btn-20w-20h delete-btn"
                    onClick={() => {
                      if (!deleted) handleDelete();
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </div>
                {isSubmit ? (
                  <button className="form-button" type="submit" disabled>
                    <PulseLoader size={5} color={loaderColor} />
                  </button>
                ) : (
                  <button className="form-button" type="submit">
                    Edit Catagory
                  </button>
                )}
              </div>
            </form>
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

export default EditCatagory;
