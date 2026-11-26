// this file starts react, connects the shared redux store, and loads global styles.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css";
import "./styles/storefront.css";

// strictmode helps point out some unsafe react patterns while developing.
// provider makes the same store available to every child component.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
