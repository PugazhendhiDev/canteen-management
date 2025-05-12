import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./configuration/firebase";
import "./App.css";

import Home from "./pages/home";
import Intro from "./pages/intro";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";
import ProfilePage from "./pages/profilePage";
import SettingsPage from "./pages/settingsPage";
import OrderPage from "./pages/orderPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        const updatedUser = auth.currentUser;

        if (updatedUser?.emailVerified) {
          if (!localStorage.getItem("email_verified")) {
            await updatedUser.getIdToken(true);
            localStorage.setItem("email_verified", true);
            setUser(auth.currentUser);
          } else {
            setUser(updatedUser);
          }
        } else {
          setUser(false);
        }
      } else {
        setUser(false);
      }

      const elapsed = Date.now() - startTime;
      const delay = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoading(false), delay);
    });

    return () => unsubscribe();
  }, [location]);

  useEffect(() => {
    setRouteLoading(true);
    const timeout = setTimeout(() => setRouteLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading || routeLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader-container">
          <div className="loader-item"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        index
        element={user && user.emailVerified ? <Home /> : <Intro />}
      />
      <Route
        path="/login"
        element={
          user && user.emailVerified ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/forgot-password"
        element={
          user && user.emailVerified ? (
            <Navigate to="/" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          user && user.emailVerified ? (
            <ResetPassword />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/profile"
        element={
          user && user.emailVerified ? (
            <ProfilePage email={user.email} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/settings"
        element={
          user && user.emailVerified ? (
            <SettingsPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/order-page/:id"
        element={
          user && user.emailVerified ? (
            <OrderPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
