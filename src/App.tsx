import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { ConnectWallet } from "./components/connect-wallet";
import { Index } from "./components";
import { getConnectWalletRoute, gotoConnectWallet, gotoGremlins } from "./utils/routes";
import { getCachedAccount } from "./utils/web3";
import { globalStore, IStore } from "./utils/store";
import { useRexContext } from "./utils/store/store";
import { Location } from "history";
import { matchPath } from "react-router";

interface IProps {
  location: Location;
}

export const App: React.SFC<IProps> = (props) => {
  const { location } = props;
  const { walletAddress } = useRexContext((store: IStore) => store);

  async function checkAccount() {
    const address = await getCachedAccount();

    if (address) {
      globalStore.update((store) => {
        store.walletAddress = address;
      });

      if (matchPath(location.pathname, { path: getConnectWalletRoute(), exact: true })) {
        gotoGremlins();
      }
    } else {
      gotoConnectWallet();
    }
  }

  useEffect(() => {
    checkAccount();
  }, [walletAddress]);

  return (
    <Switch>
      <Route exact path={getConnectWalletRoute()} component={ConnectWallet} />
      <Route component={Index} />
    </Switch>
  );
};
