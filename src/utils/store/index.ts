import { createStore } from "./store";

export interface IStore {
  walletAddress?: string;
}

export function getInitialStore(): IStore {
  return {};
}

export const globalStore = createStore<IStore>();
