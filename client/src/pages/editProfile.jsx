import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../configuration/axios";
import "./pages.css";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import Logo from "../assets/logo.jpeg";

function EditProfile() {
  const [userData, setUserData] = useState({});
  const [batchList, setBatchList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserData = sessionStorage.getItem("userData");

      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        try {
          const response = await axiosInstance.get("/api/get-user-details");
          if (response.data.data) {
            const user = response.data.data;
            setUserData(user);

            sessionStorage.setItem("userData", JSON.stringify(user));
          } else {
            setUserData({});
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    };

    const fetchBatch = async () => {
      try {
        const response = await axiosInstance.get("/api/get-batch-list");
        if (response.data.data) {
          setBatchList(response.data.data);
        } else {
          setBatchList([]);
        }
      } catch (err) {
        console.error("Error fetching batch list", err);
      }
    };

    fetchUser();
    fetchBatch();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      await axiosInstance.put("/api/update-user-details", userData);

      setIsSubmit(false);

      toast.success("Update successful!", {
        onClose: () => {
          sessionStorage.setItem("userData", JSON.stringify(userData));
          navigate(-1);
        },
      });
    } catch (err) {
      toast.error(String(err.message));
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
          <h2 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h2>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <ToastContainer />
          <form className="form-container" onSubmit={handleUpdate}>
            <div className="form-header">
              <img src={Logo} alt="Logo" />
            </div>
            <div className="form-body">
              <input
                className="form-input"
                placeholder="Enter your name"
                type="text"
                name="name"
                value={userData.name || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Enter your roll no"
                type="text"
                name="roll_no"
                value={userData.roll_no || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    roll_no: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Enter your department"
                type="text"
                name="dept"
                value={userData.dept || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    dept: e.target.value,
                  })
                }
                required
              />
              <input
                className="form-input"
                placeholder="Enter your section"
                type="text"
                name="section"
                value={userData.section || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    section: e.target.value,
                  })
                }
                required
              />
              <select
                className="form-select"
                name="year"
                value={userData.year || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    year: e.target.value,
                  })
                }
              >
                <option value="">Select a year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <select
                className="form-select"
                name="batch"
                value={userData.batch || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    batch: e.target.value,
                  })
                }
              >
                <option value="">Select a batch</option>
                {batchList.map((item, index) => (
                  <option key={index} value={item.batch}>
                    {item.batch}
                  </option>
                ))}
              </select>

              {isSubmit ? (
                <button className="form-button" type="submit" disabled>
                  <PulseLoader size={5} color={loaderColor} />
                </button>
              ) : (
                <button className="form-button" type="submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
