import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

// Import pages
const Login = React.lazy(() => import("./pages/Login/Login"));
const Demo = React.lazy(() => import("./pages/Demo"));

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
