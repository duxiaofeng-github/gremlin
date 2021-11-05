import { globalStore } from "./store";
import { connectAccount, disconnectAccount } from "./web3";

export function maskString(str: string, from: number, to: number, replacement: string) {
  const head = str.slice(0, from);
  const tail = str.slice(str.length - to);

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
