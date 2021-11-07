import { globalStore } from "./store";
import {
  cancelMarketOfferById,
  connectAccount,
  disconnectAccount,
  fillMarketOfferById,
  getNetworkId,
  loadContract,
  loadMarketOffers,
  loadNFTById,
  loadNFTsByAddress,
  loadNFTsByMarketOffers,
  makeMarketOfferById,
  MarketOfferData,
  NFTData,
} from "./web3";
import gremlinAbi from "../../blockchain/abis/Gremlin.json";
import marketAbi from "../../blockchain/abis/GremlinMarketplace.json";

export function maskString(str: string, headNumber: number, tailNumber: number, replacement: string) {
  const head = str.slice(0, headNumber);
  const tail = str.slice(str.length - tailNumber);

  return head + replacement + tail;
}

export function parseId(id?: string | number | null) {
  if (id == null) {
    return 0;
  }

  if (typeof id === "number") {
    return id;
  }

  const idParsed = parseInt(id);

  if (isNaN(idParsed)) {
    return 0;
  }

  return idParsed;
}

export async function connectWallet() {
  const walletAddress = await connectAccount();

  globalStore.update((store) => {
    store.walletAddress = walletAddress;
  });
}

export async function disconnectWallet() {
  await disconnectAccount();

  globalStore.update((store) => {
    store.walletAddress = undefined;
  });
}

export function replacePathParameters(path: string, parameters: any) {
  let result = path;

  Object.keys(parameters).forEach((key) => {
    result = result.replace(`:${key}`, `${parameters[key]}`);
  });

  return result;
}

export function scrollTo(options: { element: HTMLElement; to: number; duration?: number; scrollTop?: boolean }) {
  const { element, to, duration = 1000, scrollTop = true } = options;
  const start = scrollTop ? element.scrollTop : element.scrollLeft;
  const change = to - start;
  const startDate = +new Date();
  // t = current time
  // b = start value
  // c = change in value
  // d = duration
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = () => {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;

    element.scrollTop = parseInt(`${easeInOutQuad(currentTime, start, change, duration)}`);

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      element.scrollTop = to;
    }
  };

  animateScroll();
}

export async function fillNFTsMetaData(nfts: NFTData[]) {
  const promises = nfts.map((token) => {
    const { tokenUri } = token;

    return fetch(`${ipfsHost}/ipfs/${tokenUri}?clear`);
  });

  const responses = await Promise.all(promises);

  const jsonPromises = responses.map((item) => {
    if (!item.ok) {
      console.error(item.status);

      return null;
    } else {
      return item.json();
    }
  });

  const metaDatas = await Promise.all(jsonPromises);

  metaDatas.forEach((item, index) => {
    if (item != null) {
      nfts[index].metaData = item;
    }
  });

  return nfts;
}

export async function listMyGremlins(walletAddress: string, offers: MarketOfferData[]) {
  const networkId = await getNetworkId();

  if (networkId) {
    const contractNetworkInfo = (gremlinAbi.networks as any)[`${networkId}`];

    if (contractNetworkInfo) {
      const contract = await loadContract(gremlinAbi.abi as any, contractNetworkInfo.address);

      if (contract) {
        const myAvailableOffers = getMyAvailableOffers(offers, walletAddress);
        const gremlinsOnMarket = await loadNFTsByMarketOffers(contract, myAvailableOffers);
        const gremlins = await loadNFTsByAddress(contract, walletAddress);
        const gremlinsWithMetaData = fillNFTsMetaData(gremlinsOnMarket.concat(gremlins));

        return gremlinsWithMetaData;
      }
    }
  }
}

export async function getGremlinContract() {
  const networkId = await getNetworkId();

  if (networkId) {
    const contractNetworkInfo = (gremlinAbi.networks as any)[`${networkId}`];

    if (contractNetworkInfo) {
      const contract = await loadContract(gremlinAbi.abi as any, contractNetworkInfo.address);

      return contract;
    }
  }
}

export async function getGremlinById(id: number) {
  const contract = await getGremlinContract();

  if (contract) {
    const gremlin = await loadNFTById(contract, id);
    const [gremlinWithMetaData] = await fillNFTsMetaData([gremlin]);

    return gremlinWithMetaData;
  }
}

export async function getMarketOfferContract() {
  const networkId = await getNetworkId();

  if (networkId) {
    const contractNetworkInfo = (marketAbi.networks as any)[`${networkId}`];

    if (contractNetworkInfo) {
      const contract = await loadContract(marketAbi.abi as any, contractNetworkInfo.address);

      return contract;
    }
  }
}

export async function getMarketOffers() {
  const contract = await getMarketOfferContract();

  if (contract) {
    return loadMarketOffers(contract);
  }
}

export function getAvailableMarketOfferById(offers: MarketOfferData[], id: number) {
  return offers.find((item) => item.id === id && !item.cancelled && !item.fulfilled);
}

export function getMyAvailableOffers(offers: MarketOfferData[], walletAddress: string) {
  return offers.filter((item) => item.user === walletAddress && !item.cancelled && !item.fulfilled);
}

export async function makeOfferById(id: number, price: number, walletAddress: string) {
  const gremlinContract = await getGremlinContract();
  const marketContract = await getMarketOfferContract();

  if (gremlinContract && marketContract) {
    await makeMarketOfferById(gremlinContract, marketContract, id, price, walletAddress);
  }
}

export async function fillOfferById(id: number, walletAddress: string, price: number) {
  const contract = await getMarketOfferContract();

  if (contract) {
    await fillMarketOfferById(contract, id, walletAddress, price);
  }
}

export async function cancelOfferById(id: number, walletAddress: string) {
  const contract = await getMarketOfferContract();

  if (contract) {
    await cancelMarketOfferById(contract, id, walletAddress);
  }
}
