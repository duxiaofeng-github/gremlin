import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { provider } from "web3-core";
import { globalStore } from "./store";

let infuraId: string;

export function setInfuraId(id: string) {
  infuraId = id;
}

let web3ModalCache: Web3Modal | undefined;

function getWeb3ModalInstance() {
  if (web3ModalCache == null) {
    web3ModalCache = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
          },
        },
      },
    });
  }

  return web3ModalCache;
}

let web3Cache: Web3 | undefined;

async function getWeb3Instance(provider: provider) {
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
