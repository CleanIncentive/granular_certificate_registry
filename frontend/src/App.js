import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { AccountProvider } from "./context/AccountContext";
import { store } from "./store";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <Provider store={store}>
      <AccountProvider>
        <StrictMode>
          <AppRoutes />
        </StrictMode>
      </AccountProvider>
    </Provider>
  );
};

export default App;
