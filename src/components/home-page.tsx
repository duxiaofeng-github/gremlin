import React from "react";
import { listMyGremlins } from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { IStore } from "../utils/store";
import { useRexContext } from "../utils/store/store";
import { List } from "./common/list";
import { Loading } from "./common/loading";

interface IProps {}

export const HomePage: React.SFC<IProps> = (props) => {
  const { walletAddress } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    return walletAddress ? await listMyGremlins(walletAddress) : [];
  }, [walletAddress]);

  return (
    <Loading
      options={options}
      render={(data) => {
        return <List items={data} />;
      }}
    />
  );
};
