import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

// Import pages
const Login = React.lazy(() => import("./pages/Login/Login"));
const Demo = React.lazy(() => import("./pages/Demo"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const App = () => {

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  const isAuthenticated = getCookie('access_token');

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/certificates"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
