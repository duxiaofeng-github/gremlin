import { css } from "@linaria/core";
import React from "react";
import { listMyGremlins } from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { IStore } from "../utils/store";
import { useRexContext } from "../utils/store/store";
import { colorTextLightGray, fontSizeSmall } from "../utils/styles";
import { NFTData } from "../utils/web3";
import { FullScreenTips } from "./common/full-screen-tips";
import { List } from "./common/list";
import { Loading } from "./common/loading";

interface IProps {}

export const Gremlins: React.SFC<IProps> = (props) => {
  const { walletAddress, offers } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    return walletAddress && offers ? await listMyGremlins(walletAddress, offers) : [];
  }, [walletAddress]);

  function renderList(data: NFTData[]) {
    const sellingGremlins = data.filter((item) => item.offer != null);
    const gremlins = data.filter((item) => item.offer == null);

    return (
      <>
        {sellingGremlins.length !== 0 && (
          <>
            <div className={styleTitle}>Your Selling Gremlins</div>
            <List items={sellingGremlins} />
          </>
        )}
        {gremlins.length !== 0 && (
          <>
            <div className={styleTitle}>Your Gremlins</div>
            <List items={gremlins} />
          </>
        )}
      </>
    );
  }

  return (
    <Loading
      options={options}
      render={(data) => {
        return data && data.length ? (
          renderList(data)
        ) : (
          <FullScreenTips lightColor icon={null} mainTips="You don't have any gremlins yet" />
        );
      }}
    />
  );
};

const styleTitle = css`
  font-size: ${fontSizeSmall};
  color: ${colorTextLightGray};
  font-weight: bold;
  padding: 10px;
`;
