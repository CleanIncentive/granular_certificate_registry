import React, { useEffect } from "react";
import Cookies from "js-cookie";

// Import pages
const Login = React.lazy(() => import("./pages/Login"));

const Main = React.lazy(() => import("./pages/Main"));

const Certificate = React.lazy(() => import("./components/Certificate"));

const Device = React.lazy(() => import("./components/Device"));

const Transfer = React.lazy(() => import("./components/Transfer"));

const AccountPicker = React.lazy(() => import("./components/Account/Picker"));

const AccountManagement = React.lazy(() =>
  import("./components/Account/Management")
);

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
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
          <Route
            path="/transfer-history"
            element={<PrivateRoute element={Transfer} />}
          />
          <Route
            path="/account-management"
            element={<PrivateRoute element={AccountManagement} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
