import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { readCurrentUser } from "@store/user/userThunk";
import { useUser } from "@context/UserContext";

// Import pages
const Login = React.lazy(() => import("@pages/Login/index"));
const Main = React.lazy(() => import("@pages/Main/index"));
const Certificate = React.lazy(() => import("@components/certificate/index"));
const Device = React.lazy(() => import("@components/device/index"));
const AccountPicker = React.lazy(() => import("@components/Account/Picker/index"));
const AccountManagement = React.lazy(() => import("@components/Account/Management/index"));
const Settings = React.lazy(() => import("@pages/Settings/index"));

// const Transfer = React.lazy(() => import("./components/Transfer"));

const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  console.log("Checking authentication - token exists:", !!token);
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuth = isAuthenticated();
  console.log("PrivateRoute - isAuthenticated:", isAuth);
  return isAuth ? <Element {...rest} /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveUserData, userData } = useUser();
  const lastValidationTime = useRef(0);
  const validationInProgress = useRef(false);

  useEffect(() => {
    const validateCredentials = async () => {
      // Prevent multiple simultaneous validations
      if (validationInProgress.current) {
        return;
      }

      // Only validate if we haven't validated in the last 5 minutes
      const now = Date.now();
      const timeSinceLastValidation = now - lastValidationTime.current;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeSinceLastValidation < fiveMinutes && userData) {
        console.log("Skipping validation - recent validation exists and user data available");
        return;
      }

      validationInProgress.current = true;

      try {
        console.log("Validating credentials for path:", location.pathname);
        const userData = await dispatch(readCurrentUser()).unwrap();
        console.log("User data received:", userData);
        saveUserData(userData);
        lastValidationTime.current = now;
      } catch (err) {
        console.error("Failed to validate credentials:", err);
        
        // Check if this is an auth error requiring redirect
        if (err?.isAuthError) {
          // This is an authentication error (expired token, etc)
          message.warning(err?.message || "Your session has expired. Please log in again.", 3);
          navigate("/login");
          return;
        }
        
        // For other errors, show error message but don't automatically redirect
        // unless server explicitly returns 401 Unauthorized
        if (err?.status === 401) {
          message.error(err?.message || "Authentication failed", 3);
          navigate("/login");
        } else if (err?.status === 500) {
          // For server errors, log but don't show user-facing error messages
          // and don't redirect - let the app continue with cached data
          console.warn("Server error during validation, continuing with cached data:", err.message);
        } else {
          // For other errors, show error but try to continue
          message.error(err?.message || "Failed to load user data. Please try again later.", 3);
        }
      } finally {
        validationInProgress.current = false;
      }
    };

    if (location.pathname !== "/login") {
      validateCredentials();
    }
  }, [dispatch, location.pathname, navigate, saveUserData, userData]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/account-picker"
        element={<PrivateRoute element={AccountPicker} />}
      />
      <Route path="/" element={<Main />}>
        <Route index element={<Navigate to="/certificates" replace />} />
        {/* <Route path="/" element={<Navigate to="/certificates" />} /> */}
        <Route
          path="/certificates"
          element={<PrivateRoute element={Certificate} />}
        />
        <Route path="/devices" element={<PrivateRoute element={Device} />} />
        {/* <Route
            path="/transfer-history"
            element={<PrivateRoute element={Transfer} />}
          /> */}
        <Route
          path="/account-management"
          element={<PrivateRoute element={AccountManagement} />}
        />
        <Route
          path="/settings"
          element={<PrivateRoute element={Settings} />}
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/certificates" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
