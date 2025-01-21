import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Cookies from 'js-cookie';

// Import pages
const Login = React.lazy(() => import("./pages/Login/Login"));
const Demo = React.lazy(() => import("./pages/Demo"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = Cookies.get('access_token'); // Assuming the token is saved as 'authToken'
  return !!token; // Returns true if token exists
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  return isAuthenticated() ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/certificates" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/" element={<Navigate to="/certificates" />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
