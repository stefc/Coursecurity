import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { AppStatus } from "./features/appstate/AppStatus";
import WithThemeProvider from "./theme";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <WithThemeProvider>
    <React.StrictMode>
      <Provider store={store}>
        <App>
          <AppStatus />
        </App>
      </Provider>
    </React.StrictMode>
  </WithThemeProvider>
);
