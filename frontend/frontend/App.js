import React, { useEffect } from "react";
import Cookies from "js-cookie";

// Import pages
const Login = React.lazy(() => import("./pages/Login/Login"));
const CertificateDashboard = React.lazy(() =>
  import("./components/certificate/CertificateDashboard")
);
const DeviceDashboard = React.lazy(() =>
  import("./components/device/DeviceDashboard")
);

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { setAccountState } from "./store/account/accountSlice";

const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const setAccountDataState = async () => {
      const currentAccount = JSON.parse(Cookies.get("account_detail"));

      if (!!currentAccount) {
        await dispatch(setAccountState(currentAccount));
      }
    };

    setAccountDataState();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/certificates"
          element={<PrivateRoute element={CertificateDashboard} />}
        />
        <Route
          path="/devices"
          element={<PrivateRoute element={DeviceDashboard} />}
        />
        <Route path="/" element={<Navigate to="/certificates" />} />
      </Routes>
    </Router>
  );
};

export default App;
