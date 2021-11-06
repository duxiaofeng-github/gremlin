import { Button } from "antd-mobile";
import React from "react";
import { connectWallet } from "../utils/common";
import Logo from "../../public/logo.svg";
import {
  styleFlex,
  styleFlexAlignItemCenter,
  styleFlexDirectionColumn,
  styleFlexJustifyContentCenter,
  styleFullWidthAndHeight,
  styleMarginRight10,
} from "../utils/styles";
import { css, cx } from "@linaria/core";
import { LinkOutline } from "antd-mobile-icons";
import { useSubmission } from "../utils/hooks/use-submission";
import { gotoHomePage } from "../utils/routes";

interface IProps {}

export const ConnectWallet: React.SFC<IProps> = (props) => {
  const { triggerer, submitting } = useSubmission(async () => {
    connectWallet();

    gotoHomePage();
  });

  return (
    <div
      className={cx(
        styleFullWidthAndHeight,
        styleFlex,
        styleFlexDirectionColumn,
        styleFlexJustifyContentCenter,
        styleFlexAlignItemCenter,
      )}>
      <div className={styleLogoContainer}>
        <Logo className={styleLogo} />
      </div>
      <Button
        className={styleButton}
        loading={submitting}
        size="large"
        color="primary"
        onClick={() => {
          triggerer();
        }}>
        <LinkOutline className={styleMarginRight10} fontSize={20} />
        Connect wallet
      </Button>
    </div>
  );
};

const styleLogoContainer = css`
  position: relative;
  width: 50vw;
  max-width: 500px;

  &::before {
    display: block;
    content: " ";
    padding-top: 107%;
  }
`;

const styleLogo = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const styleButton = css`
  margin-top: 15vh;
`;
