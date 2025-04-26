import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../configuration/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function Signup() {
  const [value, setValue] = useState({
    email: "",
    password: "",
    retypePassword: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (value.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setIsSubmit(false);
      return;
    } else if (value.password !== value.retypePassword) {
      toast.error("Password don't match.");
      setIsSubmit(false);
      return;
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          value.email,
          value.password
        );

        if (userCredential) {
          const response = await axiosInstance.post("/api/admin/create-admin-account", {
            email: userCredential.user.email,
          });

          if (response) {
            await sendEmailVerification(userCredential.user);
          }
        }

        setIsSubmit(false);

        setValue({
          email: "",
          password: "",
          retypePassword: "",
        });

        navigate("/email-sent", { replace: true });
      } catch (err) {
        toast.error(String(err.message));
        setIsSubmit(false);
      }
    }
  };

  return (
    <div className="form-wrapper">
      <ToastContainer />
      <form className="form-container" onSubmit={handleSignup}>
        <h2>ADMIN</h2>
        <div className="form-header">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="form-body">
          <input
            className="form-input"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={value.email}
            onChange={(e) =>
              setValue({
                ...value,
                email: e.target.value,
              })
            }
            required
          />
          <input
            className="form-input"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={value.password}
            onChange={(e) =>
              setValue({
                ...value,
                password: e.target.value,
              })
            }
            required
          />
          <input
            className="form-input"
            placeholder="Retype password"
            type="password"
            name="password"
            value={value.retypePassword}
            onChange={(e) =>
              setValue({
                ...value,
                retypePassword: e.target.value,
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
              Signup
            </button>
          )}
        </div>
        <div className="form-footer">
          <p className="form-p">
            Already have an account?{" "}
            <Link className="form-link" to="/login">
              Login
            </Link>
          </p>
          <p className="Terms-Of-Use-And-Privacy-Policy-p">
            <Link className="form-link" to="/">
              Terms of Use
            </Link>{" "}
            |{" "}
            <Link className="form-link" to="/">
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
