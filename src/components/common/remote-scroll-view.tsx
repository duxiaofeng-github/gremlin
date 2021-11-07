import React, { ReactNode, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Loading } from "./loading";
import { ScrollView } from "./scroll-view";
import { useData } from "../../utils/hooks/use-data";

export type BaseType = { id?: number; hash?: string; orderNo?: string };

export interface MountOptions<T> {
  loadMore: () => void;
}

interface IProps<T extends BaseType> {
  className?: string;
  grow?: boolean;
  itemsPerPage?: number;
  cacheKey?: string;
  cacheType?: "memory" | "localstorage";
  cacheExpirationTime?: number;

  api: (params: { offset: number; limit: number }) => Promise<T[]>;
  postHandler?: (data: T[]) => Promise<T[]>;
  filter?: (data: T[]) => T[];
  itemRenderer: (data: T[], setData: React.Dispatch<React.SetStateAction<T[] | undefined>>) => ReactNode;
  loadingRenderer?: () => ReactNode;
  endedRenderer?: () => ReactNode;
  noDataRenderer: () => ReactNode;
  onRef?: (options: MountOptions<T>) => void;
  onLoad?: (data: T[]) => void;
}

interface RSVCache<T = any> {
  since: number;
  data?: T;
  offset?: number;
  noMoreData?: boolean;
  scrollTop?: number;
}

let memoryCache: { [cacheKey: string]: RSVCache } = {};

export function RemoteScrollView<T extends BaseType>(props: IProps<T>): React.ReactElement<IProps<T>> | null {
  const {
    className,
    itemsPerPage = 10,
    grow,
    cacheKey,
    cacheType = "memory",
    cacheExpirationTime = -1,
    api,
    postHandler,
    filter,
    itemRenderer,
    loadingRenderer,
    endedRenderer,
    noDataRenderer,
    onRef,
    onLoad,
  } = props;
  const cacheData = useMemo(() => {
    return cacheKey ? getCache<T[]>(cacheKey, cacheType, cacheExpirationTime) : undefined;
  }, [cacheKey, cacheType, cacheExpirationTime]);
  const [noMoreData, setNoMoreData] = useState(cacheData ? cacheData.noMoreData : false);
  const [offset, setOffset] = useState(cacheData && cacheData.offset ? cacheData.offset : 0);
  const [scrollTop, setScrollTop] = useState(0);
  const [inited, setInited] = useState(false);

  const { data, loading, error, retry, setData } = useData(async () => {
    let newData: T[];

    if (cacheData && cacheData.data && !data) {
      newData = filter ? filter(cacheData.data) : cacheData.data;
    } else {
      const nextData: T[] = await api({ offset, limit: itemsPerPage + 20 });
      const { newData: newFilteredData, newNoMoreData } = removeDuplicateItems({
        nextData,
        data,
        itemsPerPage,
      });

      const postHandlerData = postHandler ? await postHandler(newFilteredData) : newFilteredData;

      newData = filter ? filter(postHandlerData) : postHandlerData;

      setNoMoreData(newNoMoreData);
    }

    if (!inited) {
      setTimeout(() => {
        if (cacheData && cacheData.scrollTop) {
          setScrollTop(cacheData.scrollTop);
        }

        if (onLoad) {
          onLoad(newData);
        }
      });

      setInited(true);
    }

    return newData;
  }, [offset, cacheData]);

  function loadMore() {
    if (!loading && !noMoreData) {
      setOffset(offset + itemsPerPage);
    }
  }

  useEffect(() => {
    if (onRef) {
      onRef({
        loadMore,
      });
    }
  }, [loading, noMoreData]);

  useEffect(() => {
    return () => {
      if (cacheKey) {
        setCache({
          cacheKey,
          cacheType,
          data,
          offset,
          noMoreData,
        });
      } else {
        clearCache();
      }
    };
  }, [cacheKey, data, offset, noMoreData, cacheType]);

  return (
    <ScrollView
      className={className}
      grow={grow}
      scrollTop={scrollTop}
      onUnmount={({ scrollTop }) => {
        if (cacheKey) {
          setCache({
            cacheKey,
            cacheType,
            scrollTop,
          });
        }
      }}
      onScrollEnd={() => {
        loadMore();
      }}>
      <Loading
        data={data}
        error={error}
        retry={retry}
        loading={!inited ? loading : false}
        render={(data) => {
          return data && data.length > 0 ? (
            <>
              {itemRenderer(data, setData)}
              {!noMoreData ? (loadingRenderer ? loadingRenderer() : null) : endedRenderer ? endedRenderer() : null}
            </>
          ) : (
            noDataRenderer()
          );
        }}
      />
    </ScrollView>
  );
}

function getRawCacheStore<T>(cacheType: "memory" | "localstorage") {
  const cacheUnparsed = cacheType === "memory" ? memoryCache : localStorage.getItem("rsvCache");
  const cache: { [cacheKey: string]: RSVCache<T> } | null =
    typeof cacheUnparsed === "string" ? JSON.parse(cacheUnparsed) : cacheUnparsed;

  return cache;
}

function getRawCache<T>(cacheKey: string, cacheType: "memory" | "localstorage"): RSVCache<T> | null {
  const cache = getRawCacheStore<T>(cacheType);

  return cache ? cache[cacheKey] : null;
}

function getCache<T>(
  cacheKey: string,
  cacheType: "memory" | "localstorage",
  cacheExpirationTime: number,
): RSVCache<T> | undefined {
  const cache = getRawCache<T>(cacheKey, cacheType);

  if (cache) {
    if (!isCacheExpired(cache, cacheExpirationTime)) {
      return cache;
    }
  }
}

function setCache(options: {
  cacheKey: string;
  cacheType: "memory" | "localstorage";
  data?: any;
  offset?: number;
  noMoreData?: boolean;
  scrollTop?: number;
}) {
  const { cacheKey, cacheType, ...cacheData } = options;
  const cacheStore = getRawCacheStore(cacheType) || {};
  const existedCache = getRawCache(cacheKey, cacheType);
  const newCache = {
    ...cacheStore,
    [cacheKey]: {
      since: existedCache ? existedCache.since : dayjs().unix(),
      ...existedCache,
      ...cacheData,
    },
  };

  if (cacheType === "memory") {
    memoryCache = newCache;
  } else {
    localStorage.setItem("rsvCache", JSON.stringify(newCache));
  }
}

function clearCache() {
  memoryCache = {};
  localStorage.removeItem("rsvCache");
}

function isCacheExpired(cache: RSVCache, cacheExpirationTime: number) {
  if (cacheExpirationTime === -1) {
    return false;
  }

  return dayjs.unix(cache.since).add(cacheExpirationTime, "second").isBefore(dayjs());
}

function removeDuplicateItems<T extends BaseType>(options: {
  nextData: T[];
  data?: T[];
  itemsPerPage: number;
}): { newData: T[]; newNoMoreData: boolean } {
  const { nextData, data, itemsPerPage } = options;

  if (nextData && nextData.length) {
    let newData = nextData;
    const firstData = nextData[0];
    const index =
      data && data.length
        ? [...data].reverse().findIndex((item) => {
            return (
              (item.id != null && firstData.id != null && item.id === firstData.id) ||
              (item.orderNo != null && firstData.orderNo != null && item.orderNo === firstData.orderNo) ||
              (item.hash != null && firstData.hash != null && item.hash === firstData.hash)
            );
          })
        : -1;

    if (index !== -1) {
      const skipCount = data && data.length ? index + 1 : 0;

      newData = nextData.slice(skipCount, skipCount + itemsPerPage);
    } else {
      newData = nextData.slice(0, itemsPerPage);
    }

    const newNoMoreData = nextData.length < itemsPerPage;

    if (data && data.length) {
      newData.unshift(...data);
    }

    return { newData, newNoMoreData };
  } else {
    return { newData: data && data.length ? data : [], newNoMoreData: true };
  }
}
