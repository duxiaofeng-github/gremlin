import React from "react";
import { listGremlinsByOffers } from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { IStore, updateOffers } from "../utils/store";
import { useRexContext } from "../utils/store/store";
import { NFTData } from "../utils/web3";
import { FullScreenTips } from "./common/full-screen-tips";
import { List } from "./common/list";
import { Loading } from "./common/loading";
import { RemoteScrollView } from "./common/rsv";

interface IProps {}

export const MarketPlace: React.SFC<IProps> = (props) => {
  const { walletAddress } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    const offers = await updateOffers();
    const unfullfilOffers = offers && offers.filter((item) => !item.cancelled && !item.fulfilled);

    return unfullfilOffers;
  }, [walletAddress]);

  return (
    <Loading
      options={options}
      render={(data) => {
        return (
          <RemoteScrollView<NFTData>
            api={async (params) => {
              const { offset, limit } = params;
              const offers = data.slice(offset, offset + limit);
              const gremlins = await listGremlinsByOffers(offers);

              return gremlins || [];
            }}
            itemRenderer={(data) => {
              return data && data.length ? (
                <List items={data} />
              ) : (
                <FullScreenTips lightColor icon={null} mainTips="You don't have any gremlins yet" />
              );
            }}
          />
        );
      }}
    />
  );
};
