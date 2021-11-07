import { css } from "@linaria/core";
import React from "react";
import { colorTextLightGray, fontSizeLarge, fontSizeSmall } from "../../utils/styles";
import { NFTData } from "../../utils/web3";
import { List as AntdList } from "antd-mobile";
import { gotoGrelinDetail } from "../../utils/routes";
import { formatPrice } from "../../utils/common";
import Eth from "../../../public/eth.svg";

interface IProps {
  items: NFTData[];
}

export const List: React.SFC<IProps> = (props) => {
  const { items } = props;

  return (
    <AntdList>
      {items.map((item) =>
        item.metaData ? (
          <AntdList.Item
            key={item.id}
            arrow
            prefix={<img className={styleCover} src={item.metaData.image} />}
            description={
              <div>
                <div
                  className={styleDescription}
                  onClick={() => {
                    gotoGrelinDetail({ id: `${item.id}` });
                  }}>
                  {item.metaData.description}
                </div>
                {item.offer != null ? (
                  <div className={stylePrice}>
                    <Eth className={styleIcon} width={20} height={20} fill="var(--adm-color-text)" />
                    {formatPrice(item.offer.price)}
                  </div>
                ) : null}
              </div>
            }>
            <div className={styleName}>{item.metaData.name}</div>
          </AntdList.Item>
        ) : null,
      )}
    </AntdList>
  );
};

const styleCover = css`
  height: 20vw;
  width: 20vw;
  max-height: 100px;
  max-width: 100px;
`;

const styleName = css`
  font-size: ${fontSizeLarge};
  font-weight: bold;
`;

const styleDescription = css`
  font-size: ${fontSizeSmall};
  color: ${colorTextLightGray};
  margin-top: 10px;
`;

const styleIcon = css`
  margin-left: -3px;
  margin-right: 5px;
`;

const stylePrice = css`
  display: flex;
  align-items: center;
  color: var(--adm-color-primary);
  font-weight: bold;
  margin-top: 10px;
`;
