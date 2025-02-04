import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <Provider store={store}>
      <StrictMode>
        <AppRoutes />
      </StrictMode>
    </Provider>
  );
};

export default App;
