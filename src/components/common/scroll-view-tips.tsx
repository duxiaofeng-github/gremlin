import React from "react";
import { css, cx } from "@linaria/core";
import { colorTextLightGray } from "../../utils/styles";

interface IProps {
  className?: string;
}

export const ScrollViewTips: React.SFC<IProps> = (props) => {
  const { className, children } = props;

  return <div className={cx(styleTips, className)}>{children}</div>;
};

const styleTips = css`
  padding: 15px;
  text-align: center;
  color: ${colorTextLightGray};
`;
