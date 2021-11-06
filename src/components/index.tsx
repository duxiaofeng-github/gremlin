import React, { useMemo } from "react";
import { TabBar } from "antd-mobile";
import {
  getHomePagePath,
  getHomePageRoute,
  getMarketPlaceRoute,
  getUserRoute,
  gotoHomePage,
  gotoMarketPlace,
  gotoUser,
} from "../utils/routes";
import { AppOutline, ShopbagOutline, UserOutline } from "antd-mobile-icons";
import { Route, Switch, Redirect } from "react-router-dom";
import { styleFlex, styleFlexDirectionColumn, styleFullWidthAndHeight, styleNoShrink } from "../utils/styles";
import { cx } from "@linaria/core";
import { ScrollView } from "./common/scroll-view";
import { HomePage } from "./home-page";
import { User } from "./user";
import { MarketPlace } from "./market-place";
import { Location } from "history";
import { matchPath } from "react-router";

interface IProps {
  location: Location;
}

const tabs = [
  {
    key: "homePage",
    title: "Home",
    icon: <AppOutline />,
    route: getHomePageRoute(),
    component: HomePage,
    onClick: () => gotoHomePage(),
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
  const matchedTab = useMemo(
    () =>
      tabs.find((item) => {
        return matchPath(location.pathname, { path: item.route, exact: true });
      }),
    [location],
  );

  return (
    <div className={cx(styleFullWidthAndHeight, styleFlex, styleFlexDirectionColumn)}>
      <ScrollView grow>
        <Switch>
          {tabs.map((item) => {
            return <Route key={item.key} exact path={item.route} component={item.component} />;
          })}
          <Route render={() => <Redirect to={getHomePagePath()} />} />
        </Switch>
      </ScrollView>
      <div className={styleNoShrink}>
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
};
