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

const AccountPicker = React.lazy(() =>
  import("./components/account/AccountPicker")
);

const AccountManagement = React.lazy(() =>
  import("./pages/AccountManagement/AccountManagement")
);

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";
import { setAccountState } from "./store/account/accountSlice";
import { setCurrentUserInfoState } from "./store/user/userSlice";

const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" />;
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const setAccountAndUserDataState = async () => {
      const accountDetail = Cookies.get("account_detail");
      const userDataDetail = Cookies.get("user_data");

      const currentAccount = accountDetail ? JSON.parse(accountDetail) : {};
      const userData = userDataDetail ? JSON.parse(userDataDetail) : {};

      await Promise.all([
        !isEmpty(currentAccount) && dispatch(setAccountState(currentAccount)),
        !isEmpty(userData) && dispatch(setCurrentUserInfoState(userData)),
      ]);
    };

    setAccountAndUserDataState();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/account-picker"
          element={<PrivateRoute element={AccountPicker} />}
        />
        <Route
          path="/account-management"
          element={<PrivateRoute element={AccountManagement} />}
        />
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
