import React, { useEffect, useState } from "react";
import { cx, css } from "@linaria/core";
import { scrollTo } from "../../utils/common";

interface IProps {
  className?: string;
  grow?: boolean;
  threshold?: number;
  scrollTop?: number;
  scrollTopAnimation?: boolean;
  onTouchStart?: (e: TouchEvent) => void;
  onTouchMove?: (e: TouchEvent) => void;
  onTouchEnd?: (e: TouchEvent) => void;
  onScroll?: (e: Event) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  onUnmount?: (data: { scrollTop: number }) => void;
}

export const ScrollView: React.SFC<IProps> = (props) => {
  const {
    className,
    children,
    grow,
    scrollTop,
    scrollTopAnimation,
    threshold = 20,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onScroll,
    onScrollEnd,
    onScrollStart,
    onUnmount,
  } = props;

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  function handleScroll(e: Event) {
    if (onScrollEnd == null && onScrollStart == null && onScroll == null) {
      return;
    }

    if (onScroll) {
      onScroll(e);
    }

    let started = false;
    let ended = false;

    if (onScrollStart) {
      const { scrollTop } = e.target as HTMLDivElement;

      if (scrollTop <= threshold && !started) {
        started = true;
        onScrollStart();
      } else if (scrollTop >= threshold && started) {
        started = false;
      }
    }

    if (onScrollEnd) {
      const { clientHeight, scrollHeight, scrollTop } = e.target as HTMLDivElement;

      if (scrollTop + clientHeight >= scrollHeight - threshold && !ended) {
        ended = true;
        onScrollEnd();
      } else if (scrollTop + clientHeight <= scrollHeight - threshold && ended) {
        ended = false;
      }
    }
  }

  useEffect(() => {
    if (containerEl != null) {
      containerEl.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      if (onTouchStart) {
        containerEl.addEventListener("touchstart", onTouchStart, {
          passive: true,
        });
      }

      if (onTouchMove) {
        containerEl.addEventListener("touchmove", onTouchMove, {
          passive: true,
        });
      }

      if (onTouchEnd) {
        containerEl.addEventListener("touchend", onTouchEnd, {
          passive: true,
        });
      }
    }

    return () => {
      if (containerEl != null) {
        containerEl.removeEventListener("scroll", handleScroll);

        if (onTouchStart) {
          containerEl.removeEventListener("touchstart", onTouchStart);
        }

        if (onTouchMove) {
          containerEl.removeEventListener("touchmove", onTouchMove);
        }

        if (onTouchEnd) {
          containerEl.removeEventListener("touchend", onTouchEnd);
        }
      }
    };
  }, [threshold, containerEl, onScrollEnd, onScrollStart, onScroll, onTouchStart, onTouchMove, onTouchEnd]);

  useEffect(() => {
    if (containerEl != null && scrollTop != null) {
      if (!scrollTopAnimation) {
        containerEl.scrollTop = scrollTop;
      } else {
        scrollTo({ element: containerEl, to: scrollTop });
      }
    }
  }, [scrollTop]);

  return (
    <div
      ref={(el) => {
        if (el == null && containerEl && onUnmount) {
          onUnmount({ scrollTop: containerEl.scrollTop });
        }

        setContainerEl(el);
      }}
      className={cx(styleScrollView, grow ? "grow" : "full", className)}>
      {children}
    </div>
  );
};

const styleScrollView = css`
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;

  & > * {
    flex-shrink: 0;
  }

  &.full {
    width: 100%;
    height: 100%;
  }

  &.grow {
    flex-grow: 1;
  }
`;
