import React from "react";
import ReactDOM  from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, createStoreHook } from "redux"; // Import createStore and createStoreHook separately

import mainMapReducer from "./components/testing-javascripts/reducers/mainMapRootReducer";

const mainMapStore = createStore(mainMapReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={mainMapStore}>
      <App />
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
