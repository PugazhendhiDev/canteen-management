import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./pages.css";
import Logo from "../assets/logo.jpeg";
import ProfileIcon from "../assets/icons/profileIcon";
import axiosInstance from "../configuration/axios";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "../assets/icons/editIcon";
import DeleteIcon from "../assets/icons/deleteIcon";

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [deleted, setDeleted] = useState(false);

  const fetchAccounts = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/fetch-accounts");
      setAccounts(
        Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data]
      );
    } catch (err) {
      console.error("Error fetching accounts", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function handleDelete(uid) {
    setDeleted(true);
    toast("Deleting...");
    try {
      const res = await axiosInstance.delete("/api/admin/delete-account", {
        data: { uid },
      });

      fetchAccounts();

      setDeleted(false);
      toast.success(res.data.message);
    } catch (err) {
      setDeleted(false);
      toast.error(err.response?.data?.error || "Something went wrong!");
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
          <h2 className="page-app-title">{import.meta.env.VITE_APP_NAME}</h2>
        </div>
        <div className="page-app-profile">
          <Link to="/profile">
            <ProfileIcon />
          </Link>
        </div>
      </div>
      <div className="page-container">
        <div className="page-body">
          <h2>ADMIN</h2>
          {accounts && (
            <div className="page-list-view-container">
              {accounts.map((value, index) => (
                <div className="page-list-view-item" key={index}>
                  <h2>
                    {value.name && value.name.length > 10
                      ? `${value.name.slice(
                          0,
                          5
                        )}...${value.name.slice(-5)}`
                      : value.name || "No name"}
                  </h2>
                  <p>{value.email}</p>
                  <div className="page-btn-container">
                    <Link className="page-btn btn-20w-20h" to={`/edit-account/${value.uid}`}>
                      <EditIcon />
                    </Link>
                    <div
                      className="page-btn btn-20w-20h delete-btn"
                      onClick={() => {
                        if (!deleted) handleDelete(value.uid);
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountManagement;
