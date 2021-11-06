import React, { ReactChild } from "react";
import { cx, css } from "@linaria/core";
import { CheckCircleOutline, CloseCircleOutline, InformationCircleOutline } from "antd-mobile-icons";

interface IProps {
  type?: "warning" | "error" | "success";
  icon?: ReactChild | null;
  mainTips: ReactChild;
  lightColor?: boolean;
  brief?: ReactChild;
  grow?: boolean;
}

export function getWarningIcon(style?: string) {
  return <InformationCircleOutline className={cx(styleIcon, styleWarning, style)} />;
}

export function getSuccessIcon(style?: string) {
  return <CheckCircleOutline className={cx(styleIcon, styleSuccess, style)} />;
}

export function getErrorIcon(style?: string) {
  return <CloseCircleOutline className={cx(styleIcon, styleError, style)} />;
}

const styleIcon = css`
  font-size: 50px;
`;

const styleWarning = css`
  color: #ffc600;
`;

const styleSuccess = css`
  color: #6abf47;
`;

const styleError = css`
  color: #f4333c;
`;

function getIcon(props: IProps) {
  const { icon, type } = props;

  if (icon !== undefined) {
    return icon;
  }

  switch (type) {
    case "error":
      return getErrorIcon();
    case "success":
      return getSuccessIcon();
    case "warning":
      return getWarningIcon();
  }

  return getWarningIcon();
}

export const FullScreenTips: React.SFC<IProps> = (props) => {
  const { grow, lightColor, mainTips, brief } = props;

  return (
    <div className={cx(styleContainer, grow ? styleGrow : styleFull)}>
      {getIcon(props)}
      <div className={cx(styleMainTips, lightColor && "light")}>{mainTips}</div>
      {brief && (
        <div className={styleBrief}>
          {typeof brief === "string" ? <div className={styleTextBrief}>{brief}</div> : brief}
        </div>
      )}
    </div>
  );
};

const styleContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
`;

const styleGrow = css`
  flex-grow: 1;
`;

const styleFull = css`
  width: 100%;
  height: 100%;
`;

const styleMainTips = css`
  margin-top: 20px;
  font-size: 16px;

  &.light {
    color: #888;
  }
`;

const styleBrief = css`
  margin-top: 10px;
`;

const styleTextBrief = css`
  color: #888;
`;
