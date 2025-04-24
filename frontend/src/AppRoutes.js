import React, { useEffect } from "react";
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
const AdminUserPage = React.lazy(() => import("@pages/Admin/AdminUserPage"));

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
  const { saveUserData } = useUser();

  useEffect(() => {
    const validateCredentials = async () => {
      try {
        console.log("Validating credentials for path:", location.pathname);
        const userData = await dispatch(readCurrentUser()).unwrap();
        console.log("User data received:", userData);
        
        // Check if we're using fallback data from a server error
        if (userData._error) {
          console.warn("Using fallback user data due to server error:", userData._error);
          message.warning(
            "There was a problem connecting to the server. Some features may be limited.",
            5
          );
        }
        
        saveUserData(userData);
      } catch (err) {
        console.error("Failed to validate credentials:", err);
        
        // Check if this is an auth error requiring redirect
        if (err?.isAuthError) {
          // This is an authentication error (expired token, etc)
          message.warning(err?.message || "Your session has expired. Please log in again.", 3);
          navigate("/login");
          return;
        }
        
        // For server errors (500), show a more helpful message but try to continue
        if (err?.status === 500) {
          message.error("Server error. Please try again later or contact support if the problem persists.", 5);
          
          // Check if we're on a path that requires authentication
          if (location.pathname !== "/certificates" && location.pathname !== "/") {
            // Redirect to a "safe" page
            navigate("/certificates");
          }
          return;
        }
        
        // For other errors, show error message but don't automatically redirect
        // unless server explicitly returns 401 Unauthorized
        if (err?.status === 401) {
          message.error(err?.message || "Authentication failed", 3);
          navigate("/login");
        } else {
          // For server errors (500, etc), show error but try to continue
          message.error(err?.message || "Failed to load user data. Please try again later.", 3);
        }
      }
    };

    if (location.pathname !== "/login") {
      validateCredentials();
    }
  }, [dispatch, location.pathname, navigate, saveUserData]);

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
          path="/admin/users"
          element={<PrivateRoute element={AdminUserPage} />}
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/certificates" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
