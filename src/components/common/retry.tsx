import React from "react";
import { FullScreenTips } from "./full-screen-tips";
import { css, cx } from "@linaria/core";
import { CloseCircleOutline } from "antd-mobile-icons";

interface IProps {
  retry?: () => void;
  lightColor?: boolean;
  tips?: string;
}

export const Retry: React.SFC<IProps> = (props) => {
  const { retry, tips, lightColor } = props;

  return (
    <FullScreenTips
      type="error"
      lightColor={lightColor}
      mainTips={tips || "Something went wrong"}
      brief={
        retry && (
          <a className={cx(styleRetryLink)} onClick={retry}>
            Retry
          </a>
        )
      }
    />
  );
};

const styleRetryLink = css`
  margin-top: 10px;
`;

const styleIcon = css`
  width: 128px;
  height: 128px;
  -webkit-filter: grayscale(1) brightness(1.5);
  filter: grayscale(1) brightness(1.5);
`;
