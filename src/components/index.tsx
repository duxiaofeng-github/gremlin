import React from "react";
import { useEffect, useState } from "react";
import { getCachedAccount } from "../utils/web3";
import { globalStore } from "../utils/store";
import { TabBar } from "antd-mobile";
import {
  getHomePagePath,
  getHomePageRoute,
  getMarketPlacePath,
  getMarketPlaceRoute,
  getUserPath,
  getUserRoute,
  gotoConnectWallet,
} from "../utils/routes";
import { AppOutline, ShopbagOutline, UserOutline } from "antd-mobile-icons";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { styleFlex, styleFlexDirectionColumn, styleFullWidthAndHeight, styleNoShrink } from "../utils/styles";
import { cx } from "@linaria/core";
import { ScrollView } from "./common/scroll-view";
import { HomePage } from "./home-page";
import { User } from "./user";
import { MarketPlace } from "./market-place";

interface IProps {}

const tabs = [
  { key: "homePage", title: "Home", icon: <AppOutline />, path: getHomePagePath() },
  { key: "market", title: "Market", icon: <ShopbagOutline />, path: getMarketPlacePath() },
  { key: "user", title: "User", icon: <UserOutline />, path: getUserPath() },
];

export const Index: React.SFC<IProps> = (props) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  async function checkAccount() {
    const address = await getCachedAccount();

    if (address) {
      globalStore.update((store) => {
        store.walletAddress = address;
      });
    } else {
      gotoConnectWallet();
    }
  }

  useEffect(() => {
    checkAccount();
  }, []);

  return (
    <div className={cx(styleFullWidthAndHeight, styleFlex, styleFlexDirectionColumn)}>
      <ScrollView grow>
        <Routes>
          <Route path={getUserRoute()} element={<User />} />
          <Route path={getMarketPlaceRoute()} element={<MarketPlace />} />
          <Route path={getHomePageRoute()} element={<HomePage />} />
          <Route element={<Navigate replace to={getHomePagePath()} />} />
        </Routes>
      </ScrollView>
      <div className={styleNoShrink}>
        <TabBar
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key);

            const activeItem = tabs.find((item) => item.key === key);

            if (activeItem) {
              navigate(activeItem.path);
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
