import React from "react";
import { css, cx } from "@linaria/core";
import { Retry } from "./retry";
import { Loading as AntdLoading } from "antd-mobile";

export function isLoadFailed(data: any | any[], loading: boolean) {
  if (!loading) {
    if (Array.isArray(data)) {
      const failedDataIndex = data.findIndex((item) => item == null);
      return failedDataIndex !== -1;
    } else {
      return data == null;
    }
  }

  return false;
}

export interface IOptions<T> {
  data?: T;
  loading?: boolean;
  error?: Error | boolean;
  retry?: () => void;
}

interface IProps<T> extends IOptions<T> {
  inline?: boolean;
  skipDataChecking?: boolean;
  errorTips?: string;
  options?: IOptions<T>;
  render: (data: T) => React.ReactNode;
  renderError?: (e: boolean | Error | undefined) => React.ReactNode;
}

function renderLoadingError<T>(options: IProps<T> & IOptions<T>) {
  const { renderError, retry, errorTips, error } = options;

  if (renderError != null) {
    const errorPage = renderError(error);

    if (errorPage) {
      return <>{errorPage}</>;
    }
  }

  if (error) {
    if ((error as any).status === 404) {
      return <Retry tips="Not found" />;
    }
  }

  return retry ? <Retry tips={errorTips} retry={retry} /> : null;
}

export const Loading: <T>(p: IProps<T>) => React.ReactElement<IProps<T>> | null = (props) => {
  const options = Object.assign({}, props, props.options);
  const { loading = false, error, data, render, skipDataChecking, inline } = options;

  if (loading) {
    return (
      <div className={cx(styleLoadingContainer, !inline && styleLoadingBlock)}>
        <AntdLoading />
      </div>
    );
  }

  if (error != null) {
    if (error !== false) {
      return renderLoadingError(options);
    }
  } else if (!skipDataChecking && isLoadFailed(data, loading)) {
    return renderLoadingError(options);
  }

  return <>{render(data!)}</>;
};

const styleLoadingContainer = css`
  height: 100%;
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const styleLoadingBlock = css`
  min-height: 200px;
`;
