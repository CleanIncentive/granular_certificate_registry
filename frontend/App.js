import React from 'react';

// Import pages
const Login = React.lazy(() => import('./pages/Login/Login'));
const Demo = React.lazy(() => import('./pages/Demo'));


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (

    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  </Router>
  
  );
};

export default App;