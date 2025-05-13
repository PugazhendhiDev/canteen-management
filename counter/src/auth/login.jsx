import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../configuration/firebase";
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import axiosInstance from "../configuration/axios";
import Logo from "../assets/logo.jpeg";
import { ToastContainer, toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

function Login() {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const loaderColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--loader-color")
    .trim();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(auth);
        toast.error(
          "Please verify your email before logging in. We've sent you a verification email."
        );
        setIsSubmit(false);
        setValue({
          email: "",
          password: "",
        });
        return;
      } else {
        if (user.emailVerified) {
          try {
            const response = await axiosInstance.get("/api/counter/login");

            if (response.status === 200) {
              navigate("/", { replace: true });
            } else {
              await signOut(auth);
              toast.error(String(err.response?.data?.message || err.message));
              setIsSubmit(false);
              setValue({
                email: "",
                password: "",
              });
            }
          } catch (err) {
            await signOut(auth);
            toast.error(String(err.response?.data?.message || err.message));
            setIsSubmit(false);
            setValue({
              email: "",
              password: "",
            });
          }
        }
      }

      setIsSubmit(false);
    } catch (err) {
      await signOut(auth);
      toast.error(String(err.message));
      setIsSubmit(false);
    }
  };

  return (
    <div className="form-wrapper">
      <ToastContainer />
      <form className="form-container" onSubmit={handleLogin}>
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
          <Link className="form-link" to="/forgot-password">
            <p>Forgot password</p>
          </Link>
          {isSubmit ? (
            <button className="form-button" type="submit" disabled>
              <PulseLoader size={5} color={loaderColor} />
            </button>
          ) : (
            <button className="form-button" type="submit">
              Login
            </button>
          )}
        </div>
        <div className="form-footer">
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

export default Login;
