import React, { useMemo } from "react";
import { TabBar } from "antd-mobile";
import {
  getGrelinDetailRoute,
  getGremlinsPath,
  getGremlinsRoute,
  getMarketPlaceRoute,
  getUserRoute,
  gotoGremlins,
  gotoMarketPlace,
  gotoUser,
} from "../utils/routes";
import { AppOutline, ShopbagOutline, UserOutline } from "antd-mobile-icons";
import { Route, Switch, Redirect } from "react-router-dom";
import {
  styleBackgroundWhite,
  styleBorderTop,
  styleFlex,
  styleFlexDirectionColumn,
  styleFullWidthAndHeight,
  styleNoShrink,
} from "../utils/styles";
import { cx } from "@linaria/core";
import { ScrollView } from "./common/scroll-view";
import { Gremlins } from "./gremlins";
import { User } from "./user";
import { MarketPlace } from "./market-place";
import { Location } from "history";
import { matchPath } from "react-router";
import { GremlinDetail } from "./gremlin-detail";
import { useData } from "../utils/hooks/use-data";
import { IStore, updateOffers } from "../utils/store";
import { Loading } from "./common/loading";
import { useRexContext } from "../utils/store/store";

interface IProps {
  location: Location;
}

const tabs = [
  {
    key: "homePage",
    title: "Home",
    icon: <AppOutline />,
    route: getGremlinsRoute(),
    component: Gremlins,
    onClick: () => gotoGremlins(),
  },
  {
    key: "market",
    title: "Market",
    icon: <ShopbagOutline />,
    route: getMarketPlaceRoute(),
    component: MarketPlace,
    onClick: () => gotoMarketPlace(),
  },
  {
    key: "user",
    title: "User",
    icon: <UserOutline />,
    route: getUserRoute(),
    component: User,
    onClick: () => gotoUser(),
  },
];

export const Index: React.SFC<IProps> = (props) => {
  const { location } = props;
  const { walletAddress } = useRexContext((store: IStore) => store);
  const matchedTab = useMemo(
    () =>
      tabs.find((item) => {
        return matchPath(location.pathname, { path: item.route });
      }),
    [location],
  );
  const options = useData(() => {
    return updateOffers();
  });

  return (
    <Loading
      skipDataChecking
      options={options}
      render={() => {
        return (
          <div key={walletAddress} className={cx(styleFullWidthAndHeight, styleFlex, styleFlexDirectionColumn)}>
            <ScrollView grow>
              <Switch>
                <Route
                  exact
                  path={getGrelinDetailRoute()}
                  render={({ match }) => {
                    return <GremlinDetail key={match.params.id} id={match.params.id} />;
                  }}
                />
                {tabs.map((item) => {
                  return <Route key={item.key} exact path={item.route} component={item.component} />;
                })}
                <Route render={() => <Redirect to={getGremlinsPath()} />} />
              </Switch>
            </ScrollView>
            <div className={cx(styleNoShrink, styleBackgroundWhite, styleBorderTop)}>
              <TabBar
                activeKey={matchedTab ? matchedTab.key : tabs[0].key}
                onChange={(key) => {
                  const activeItem = tabs.find((item) => item.key === key);

                  if (activeItem) {
                    activeItem.onClick();
                  }
                }}>
                {tabs.map((item) => (
                  <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                ))}
              </TabBar>
            </div>
          </div>
        );
      }}
    />
  );
};
