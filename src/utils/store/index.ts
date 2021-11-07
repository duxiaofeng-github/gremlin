import { getMarketOffers } from "../common";
import { MarketOfferData } from "../web3";
import { createStore } from "./store";

export interface IStore {
  walletAddress?: string;
  offers?: MarketOfferData[];
}

export function getInitialStore(): IStore {
  return {};
}

export const globalStore = createStore<IStore>();

export async function updateOffers() {
  const offers = await getMarketOffers();

  await globalStore.update((store) => {
    store.offers = offers;
  });

  return offers;
}
