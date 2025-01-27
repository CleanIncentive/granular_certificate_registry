import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
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

const isAuthenticated = () => {
  const token = Cookies.get("access_token");
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? <Element {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
