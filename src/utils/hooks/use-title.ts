import { useEffect } from "react";

export function useTitle(title: string|undefined | (() => string|undefined), dependencies?: any[]) {
  useEffect(() => {
    if (title != null) {
      const titleParsed = typeof title === "string" ? title : title();
      
      if (titleParsed != null) {
        document.title = titleParsed;
      }
    }
  }, dependencies);
}
