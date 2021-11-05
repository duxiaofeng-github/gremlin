import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { RexProvider } from "./utils/store/store";
import { globalStore, getInitialStore } from "./utils/store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <RexProvider store={globalStore} initialValue={getInitialStore()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RexProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
