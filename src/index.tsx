import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { RexProvider } from "./utils/store/store";
import { globalStore, getInitialStore } from "./utils/store";
import { Router, Route } from "react-router-dom";
import { history } from "./utils/routes";

ReactDOM.render(
  <React.StrictMode>
    <RexProvider store={globalStore} initialValue={getInitialStore()}>
      <Router history={history}>
        <Route component={App} />
      </Router>
    </RexProvider>
  </React.StrictMode>,
  document.getElementById("container"),
);
