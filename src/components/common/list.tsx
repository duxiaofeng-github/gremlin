import { css } from "@linaria/core";
import React from "react";
import { colorBorder, colorTextLightGray, fontSizeLarge, fontSizeSmall } from "../../utils/styles";
import { NFTData } from "../../utils/web3";
import { List as AntdList } from "antd-mobile";

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
            key={item.tokenId}
            arrow
            prefix={<img className={styleCover} src={item.metaData.image} />}
            description={<div className={styleDescription}>{item.metaData.description}</div>}>
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
