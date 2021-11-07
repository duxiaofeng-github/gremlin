import React from "react";
import { listMyGremlins } from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { IStore } from "../utils/store";
import { useRexContext } from "../utils/store/store";
import { FullScreenTips } from "./common/full-screen-tips";
import { List } from "./common/list";
import { Loading } from "./common/loading";

interface IProps {}

export const Gremlins: React.SFC<IProps> = (props) => {
  const { walletAddress, offers } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    return walletAddress && offers ? await listMyGremlins(walletAddress, offers) : [];
  }, [walletAddress]);

  return (
    <Loading
      options={options}
      render={(data) => {
        return data && data.length ? (
          <List items={data} />
        ) : (
          <FullScreenTips lightColor icon={null} mainTips="You don't have any gremlins yet" />
        );
      }}
    />
  );
};
