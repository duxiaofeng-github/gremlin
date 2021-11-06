import { css, cx } from "@linaria/core";
import { Button } from "antd-mobile";
import React from "react";
import { disconnectWallet, maskString } from "../utils/common";
import { useData } from "../utils/hooks/use-data";
import { IStore } from "../utils/store";
import { useRexContext } from "../utils/store/store";
import { colorTextLightGray, styleFlex, styleFlexDirectionColumn, styleFullWidthAndHeight } from "../utils/styles";
import { getBalance } from "../utils/web3";
import { Avatar } from "./common/avatar";
import { Loading } from "./common/loading";

interface IProps {}

export const User: React.SFC<IProps> = (props) => {
  const { walletAddress } = useRexContext((store: IStore) => store);
  const options = useData(async () => {
    return walletAddress ? await getBalance(walletAddress) : 0;
  });

  return (
    <div className={cx(styleFullWidthAndHeight, styleFlex, styleFlexDirectionColumn)}>
      <Loading
        options={options}
        render={(data) => {
          return (
            <>
              <div className={styleRow}>
                <Avatar className={styleAvatar} walletAddress={walletAddress} />
                <div className={styleContent}>
                  <div className={styleAddress}>{walletAddress}</div>
                  <div className={styleBalance}>Your balance: {data} ETH</div>
                </div>
              </div>
              <div className={styleRow}>
                <Button block color="danger" size="large" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

const styleRow = css`
  padding: 20px;
  display: flex;
  align-items: center;
`;

const styleAvatar = css`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const styleContent = css`
  flex-grow: 1;
  padding-left: 20px;
  overflow: hidden;
`;

const styleAddress = css`
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const styleBalance = css`
  margin-top: 10px;
  font-size: 14px;
  color: ${colorTextLightGray};
`;
