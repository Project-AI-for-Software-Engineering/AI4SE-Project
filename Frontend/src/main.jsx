import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";
Amplify.configure(amplifyconfig);
import "./styles.css";
import { GoSafeApp } from "./GoSafeApp";
import { BrowserRouter } from "react-router-dom";
import "@sweetalert2/theme-bulma/bulma.scss";
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GoSafeApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
