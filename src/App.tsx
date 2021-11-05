import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ConnectWallet } from "./components/connect-wallet";
import { Index } from "./components";
import { getConnectWalletRoute, getEntryPath, getEntryRoute } from "./utils/routes";

interface IProps {}

export const App: React.SFC<IProps> = () => {
  return (
    <Routes>
      <Route path={getConnectWalletRoute()} element={<ConnectWallet />} />
      <Route path={getEntryRoute()} element={<Index />} />
      <Route element={<Navigate to={getEntryPath()} replace />} />
    </Routes>
  );
};
