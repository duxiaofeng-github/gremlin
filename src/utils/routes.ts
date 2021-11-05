import { createHashHistory } from "history";
import { replacePathParameters } from "./common";

export const history = createHashHistory();

export function getEntryRoute() {
  return "/";
}

export function getEntryPath() {
  return replacePathParameters(getEntryRoute(), {});
}

export function gotoEntry() {
  history.push(getEntryPath());
}

export function getHomePageRoute() {
  return "/home";
}

export function getHomePagePath() {
  return replacePathParameters(getHomePageRoute(), {});
}

export function gotoHomePage() {
  history.push(getHomePagePath());
}

export function getConnectWalletRoute() {
  return "/connect-wallet";
}

export function getConnectWalletPath() {
  return replacePathParameters(getConnectWalletRoute(), {});
}

export function gotoConnectWallet() {
  history.push(getConnectWalletPath());
}

export interface GremlinParameters {
  id: string;
}

export function getGrelinDetailRoute() {
  return "/gremlins/:id";
}

export function getGrelinDetailPath(params: GremlinParameters) {
  return replacePathParameters(getGrelinDetailRoute(), params);
}

export function gotoGrelinDetail(params: GremlinParameters) {
  history.push(getGrelinDetailPath(params));
}

export function getMarketPlaceRoute() {
  return "/market-place";
}

export function getMarketPlacePath() {
  return replacePathParameters(getMarketPlaceRoute(), {});
}

export function gotoMarketPlace() {
  history.push(getMarketPlacePath());
}

export function getUserRoute() {
  return "/user";
}

export function getUserPath() {
  return replacePathParameters(getUserRoute(), {});
}

export function gotoUser() {
  history.push(getUserPath());
}
