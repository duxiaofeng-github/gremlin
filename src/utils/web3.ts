import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { globalStore } from "./store";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { parseId } from "./common";

let web3ModalCache: Web3Modal | undefined;

function getWeb3ModalInstance() {
  if (web3ModalCache == null) {
    web3ModalCache = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: infuraId,
          },
        },
      },
    });
  }

  return web3ModalCache;
}

let web3Cache: Web3 | undefined;

async function getWeb3Instance(provider: any) {
  if (web3Cache == null) {
    web3Cache = new Web3(provider);

    subscribeWeb3Event(provider, "disconnect", disconnectHandler);
    subscribeWeb3Event(provider, "accountsChanged", switchAccountHandler);
  }

  return web3Cache;
}

async function getAccount(web3: Web3): Promise<string | undefined> {
  const acconuts = await web3.eth.getAccounts();

  if (acconuts && acconuts.length) {
    return acconuts[0];
  }
}

async function getWeb3InstanceByWeb3Modal(web3Modal: Web3Modal) {
  const provider = await web3Modal.connect();
  return getWeb3Instance(provider);
}

export async function getCachedAccount(): Promise<string | undefined> {
  const web3Modal = getWeb3ModalInstance();

  if (web3Modal.cachedProvider) {
    const web3 = await getWeb3InstanceByWeb3Modal(web3Modal);

    return getAccount(web3);
  }
}

export async function connectAccount() {
  const web3Modal = getWeb3ModalInstance();
  const web3 = await getWeb3InstanceByWeb3Modal(web3Modal);

  return getAccount(web3);
}

export async function disconnectAccount() {
  const web3Modal = getWeb3ModalInstance();

  if (web3Modal.cachedProvider) {
    const provider = await web3Modal.connect();

    if (provider.disconnect) {
      provider.disconnect();
    } else if (provider.close) {
      provider.close();
    }

    web3Modal.clearCachedProvider();

    web3ModalCache = undefined;
    web3Cache = undefined;
  }
}

let walletAddressWaittingToSwitch = "";

function windowFocusHandler() {
  globalStore.update((store) => {
    store.walletAddress = walletAddressWaittingToSwitch;
  });

  window.removeEventListener("focus", windowFocusHandler);

  walletAddressWaittingToSwitch = "";
}

function switchAccountHandler(accounts: string[]) {
  if (accounts.length === 0) {
    globalStore.update((store) => {
      store.walletAddress = undefined;
    });
  } else {
    const walletAddress = accounts[0];

    if (document.hasFocus()) {
      globalStore.update((store) => {
        store.walletAddress = walletAddress;
      });
    } else {
      if (!walletAddressWaittingToSwitch) {
        window.addEventListener("focus", windowFocusHandler);
      }

      walletAddressWaittingToSwitch = walletAddress;
    }
  }
}

function disconnectHandler() {
  const web3Modal = getWeb3ModalInstance();

  if (web3Modal.cachedProvider) {
    web3Modal.clearCachedProvider();
  }
}

async function subscribeWeb3Event(provider: any, evt: string, handler: (data?: any) => void) {
  if (provider.on) {
    provider.on(evt, handler);
  }
}

export async function getNetworkId() {
  const web3Modal = getWeb3ModalInstance();

  const web3 = await getWeb3InstanceByWeb3Modal(web3Modal);

  return web3.eth.net.getId();
}

export async function loadContract(abi: AbiItem | AbiItem[], contractAddress: string) {
  const web3Modal = getWeb3ModalInstance();

  const web3 = await getWeb3InstanceByWeb3Modal(web3Modal);

  return new web3.eth.Contract(abi, contractAddress);
}

interface NFTMetaData {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: {
    display_type?: string;
    trait_type: string;
    value: string | number;
  }[];
}

export interface NFTData {
  tokenId: number;
  tokenUri: string;
  owner?: string;
  metaData?: NFTMetaData;
}

export async function loadNFTsByAddress(contract: Contract, walletAddress: string) {
  const balance = await contract.methods.balanceOf(walletAddress).call();
  const NFTs: NFTData[] = [];

  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call();
    const tokenUri = await loadTokenUriById(contract, tokenId);

    NFTs.push({ tokenId, tokenUri, owner: walletAddress });
  }

  return NFTs;
}

export async function loadNFTsByMarketOffers(contract: Contract, offers: MarketOfferData[]) {
  const tokenIds = offers.map((item) => item.id);
  const tokenUris = await Promise.all(tokenIds.map((tokenId) => loadTokenUriById(contract, tokenId)));
  const NFTs: NFTData[] = tokenIds.map((tokenId, index) => {
    return { tokenId, tokenUri: tokenUris[index] };
  });

  return NFTs;
}

export async function loadNFTById(contract: Contract, tokenId: number): Promise<NFTData> {
  const [tokenUri, owner] = await Promise.all([
    loadTokenUriById(contract, tokenId),
    loadTokenOwnerById(contract, tokenId),
  ]);

  return { tokenId, tokenUri, owner };
}

export async function loadTokenUriById(contract: Contract, tokenId: number): Promise<string> {
  const tokenUri = await contract.methods.tokenURI(tokenId).call();

  return tokenUri;
}

export async function loadTokenOwnerById(contract: Contract, tokenId: number): Promise<string> {
  const owner = await contract.methods.ownerOf(tokenId).call();

  return owner;
}

export interface MarketOfferData {
  id: number;
  offerId: number;
  price: number;
  user: string;
  fulfilled: boolean;
  cancelled: boolean;
}

function formatOffer(offer: any): MarketOfferData {
  const { id, offerId, price, user, fulfilled, cancelled } = offer;

  return { id: parseId(id), offerId: parseId(offerId), price: parseFloat(price), user, fulfilled, cancelled };
}

export async function loadMarketOffers(marketContract: Contract) {
  const offerCount = await marketContract.methods.offerCount().call();
  const offerPromises = [];

  for (let i = 1; i <= offerCount; i++) {
    offerPromises.push(marketContract.methods.offers(i).call());
  }

  const offers = await Promise.all(offerPromises);

  return offers.map((item) => formatOffer(item));
}

export async function cancelMarketOfferById(marketContract: Contract, tokenId: number, walletAddress: string) {
  await marketContract.methods.cancelOffer(tokenId).send({ from: walletAddress });
}

export async function makeMarketOfferById(
  gremlinContract: Contract,
  marketContract: Contract,
  tokenId: number,
  price: number,
  walletAddress: string,
) {
  const priceWei = Web3.utils.toWei(`${price}`, "ether");

  return new Promise<void>((resolve, reject) => {
    gremlinContract.methods
      .approve(marketContract.options.address, tokenId)
      .send({ from: walletAddress })
      .on("receipt", () => {
        marketContract.methods
          .makeOffer(tokenId, priceWei)
          .send({ from: walletAddress })
          .on("receipt", () => {
            resolve();
          })
          .on("error", (err: Error) => {
            reject(err);
          });
      });
  });
}

export async function fillMarketOfferById(
  marketContract: Contract,
  tokenId: number,
  walletAddress: string,
  price: number,
) {
  await marketContract.methods.fillOffer(tokenId).send({ from: walletAddress, value: `${price}` });
}

export async function getBalance(walletAddress: string) {
  const web3Modal = getWeb3ModalInstance();
  const web3 = await getWeb3InstanceByWeb3Modal(web3Modal);

  const result = await web3.eth.getBalance(walletAddress);

  return web3.utils.fromWei(result, "ether");
}
