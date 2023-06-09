import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const rootElement = document.getElementById("root") as HTMLElement;
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
  </Provider>
  </React.StrictMode>,
  rootElement
);
