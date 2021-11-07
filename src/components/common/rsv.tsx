import React, { ReactNode } from "react";
import { FullScreenTips } from "./full-screen-tips";
import { RemoteScrollView as RSV, BaseType, MountOptions } from "./remote-scroll-view";
import { ScrollViewTips } from "./scroll-view-tips";

interface IProps<T extends BaseType> {
  className?: string;
  grow?: boolean;
  itemsPerPage?: number;
  emptyIcon?: ReactNode;
  emptyText?: ReactNode;
  cacheKey?: string;
  cacheType?: "memory" | "localstorage";
  cacheExpirationTime?: number;
  hideLoadingRenderer?: boolean;
  hideEndedRenderer?: boolean;

  // 此组件可以通过抽取api成为onApiCall回调函数，进一步抽象成通用列表组件
  api: (requestParameters: { offset: number; limit: number }) => Promise<T[]>;
  postHandler?: (data: T[]) => Promise<T[]>;
  filter?: (data: T[]) => T[];
  itemRenderer: (data: T[]) => ReactNode;
  onRef?: (options: MountOptions<T>) => void;
  onLoad?: (data: T[]) => void;
}

export const RemoteScrollView: <T extends BaseType>(p: IProps<T>) => React.ReactElement<IProps<T>> | null = (props) => {
  const { api, itemsPerPage = 20, emptyIcon, emptyText, hideLoadingRenderer, hideEndedRenderer, ...restProps } = props;

  return (
    <RSV
      {...restProps}
      itemsPerPage={itemsPerPage}
      api={(params) => api({ ...params })}
      loadingRenderer={() => (!hideLoadingRenderer ? <ScrollViewTips>Loading...</ScrollViewTips> : null)}
      endedRenderer={() => (!hideLoadingRenderer ? <ScrollViewTips>Reach the end</ScrollViewTips> : null)}
      noDataRenderer={() => <FullScreenTips lightColor icon={null} mainTips="No data" />}
    />
  );
};
