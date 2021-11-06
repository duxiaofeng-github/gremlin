import { css } from "@linaria/core";

export const fontSizeXsmall = "10px";
export const fontSizeSmall = "12px";
export const fontSizeNormal = "14px";
export const fontSizeLarge = "16px";
export const fontSizeXlarge = "18px";

export const colorTextLightGray = "#9b9b9b";
export const colorBorder = "#ededed";

export const globals = css`
  :global() {
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-overflow-scrolling: touch;
    }

    * {
      padding: 0;
      margin: 0;
    }
  }
`;

export const styleMargin15 = css`
  margin: 15px;
`;

export const styleMargin20 = css`
  margin: 20px;
`;

export const styleMarginBottom3 = css`
  margin-bottom: 3px;
`;

export const styleMarginBottom5 = css`
  margin-bottom: 5px;
`;

export const styleMarginBottom10 = css`
  margin-bottom: 10px;
`;

export const styleMarginBottom15 = css`
  margin-bottom: 15px;
`;

export const styleMarginBottom20 = css`
  margin-bottom: 20px;
`;

export const styleLastChildMarginBottom0 = css`
  &:last-child {
    margin-bottom: 0;
  }
`;

export const styleMarginTop3 = css`
  margin-top: 3px;
`;

export const styleMarginTop5 = css`
  margin-top: 5px;
`;

export const styleMarginTop8 = css`
  margin-top: 8px;
`;

export const styleMarginTop10 = css`
  margin-top: 10px;
`;

export const styleMarginTop15 = css`
  margin-top: 15px;
`;

export const styleMarginTop20 = css`
  margin-top: 20px;
`;

export const styleMarginTop30 = css`
  margin-top: 30px;
`;

export const styleMarginLeft3 = css`
  margin-left: 3px;
`;

export const styleMarginLeft5 = css`
  margin-left: 5px;
`;

export const styleMarginLeft10 = css`
  margin-left: 10px;
`;

export const styleMarginLeft15 = css`
  margin-left: 15px;
`;

export const styleMarginLeft20 = css`
  margin-left: 20px;
`;

export const styleMarginLeft30 = css`
  margin-left: 30px;
`;

export const styleMarginLeft40 = css`
  margin-left: 40px;
`;

export const styleMarginRight3 = css`
  margin-right: 3px;
`;

export const styleMarginRight5 = css`
  margin-right: 5px;
`;

export const styleMarginRight10 = css`
  margin-right: 10px;
`;

export const styleMarginRight15 = css`
  margin-right: 15px;
`;

export const styleMarginRight20 = css`
  margin-right: 20px;
`;

export const styleLastChildMarginRight0 = css`
  &:last-child {
    margin-right: 0;
  }
`;

export const stylePaddingLeft5 = css`
  padding-left: 5px;
`;

export const stylePaddingLeft10 = css`
  padding-left: 10px;
`;

export const stylePaddingLeft15 = css`
  padding-left: 15px;
`;

export const stylePaddingLeft20 = css`
  padding-left: 20px;
`;

export const stylePaddingRight5 = css`
  padding-right: 5px;
`;

export const stylePaddingRight10 = css`
  padding-right: 10px;
`;

export const stylePaddingRight15 = css`
  padding-right: 15px;
`;

export const stylePaddingRight20 = css`
  padding-right: 20px;
`;

export const stylePaddingBottom5 = css`
  padding-bottom: 5px;
`;

export const stylePaddingBottom10 = css`
  padding-bottom: 10px;
`;

export const stylePaddingBottom15 = css`
  padding-bottom: 15px;
`;

export const stylePaddingBottom20 = css`
  padding-bottom: 20px;
`;

export const stylePaddingBottom30 = css`
  padding-bottom: 30px;
`;

export const stylePaddingTop5 = css`
  padding-top: 5px;
`;

export const stylePaddingTop10 = css`
  padding-top: 10px;
`;

export const stylePaddingTop15 = css`
  padding-top: 15px;
`;

export const stylePaddingTop20 = css`
  padding-top: 20px;
`;

export const stylePadding5 = css`
  padding: 5px;
`;

export const stylePadding10 = css`
  padding: 10px;
`;

export const stylePadding15 = css`
  padding: 15px;
`;

export const stylePadding20 = css`
  padding: 20px;
`;

export const styleLineHeight1 = css`
  line-height: 1em;
`;

export const styleLineHeight13 = css`
  line-height: 1.3em;
`;

export const styleLineHeight15 = css`
  line-height: 1.5em;
`;

export const styleBorderBottom = css`
  border-bottom: solid 1px #999;
`;

export const styleBorderTop = css`
  border-top: solid 1px #999;
`;

export const styleRelative = css`
  position: relative;
`;

export const styleFullWidthAndHeight = css`
  width: 100%;
  height: 100%;
`;

export const styleFlex = css`
  display: flex;
`;

export const styleFlexAlignItemStart = css`
  align-items: flex-start;
`;

export const styleFlexAlignItemCenter = css`
  align-items: center;
`;

export const styleFlexAlignItemEnd = css`
  align-items: flex-end;
`;

export const styleFlexJustifyContentStart = css`
  justify-content: flex-start;
`;

export const styleFlexJustifyContentCenter = css`
  justify-content: center;
`;

export const styleFlexJustifyContentEnd = css`
  justify-content: flex-end;
`;

export const styleFlexJustifyContentSpaceBetween = css`
  justify-content: space-between;
`;

export const styleFlexDirectionColumn = css`
  flex-direction: column;
`;

export const styleNoGrow = css`
  flex-grow: 0;
`;

export const styleNoShrink = css`
  flex-shrink: 0;
`;

export const styleGrow = css`
  flex-grow: 1;
`;

export const styleFlexWrap = css`
  flex-wrap: wrap;
`;

export const styleLineClamp2 = css`
  overflow: hidden;
  line-height: 1.2em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
`;

export const styleRichText = css`
  img {
    /* max-width: 100%; */
    width: 100%;
    height: auto;
  }

  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }
`;

export const styleTextLeft = css`
  text-align: left;
`;

export const styleTextCenter = css`
  text-align: center;
`;

export const styleTextRight = css`
  text-align: right;
`;

export const styleFontSizeXSmall = css`
  font-size: ${fontSizeXsmall};
`;

export const styleFontSizeSmall = css`
  font-size: ${fontSizeSmall};
`;

export const styleFontSizeNormal = css`
  font-size: ${fontSizeNormal};
`;

export const styleFontSizeLarge = css`
  font-size: ${fontSizeLarge};
`;

export const styleFontSizeXLarge = css`
  font-size: ${fontSizeXlarge};
`;

export const styleOverflowHidden = css`
  overflow: hidden;
`;

export const styleHeight100vh = css`
  height: 100vh;
`;

export const styleSuccessfulScreen = css`
  height: calc(100vh - 90px - 105px);

  @media (max-width: 1024px) {
    height: calc(100vh - 70px - 129px);
  }
`;

export const styleHideOnSmallScreen = css`
  @media (max-width: 1024px) {
    display: none !important;
  }
`;

export const styleVisibleOnSmallScreen = css`
  @media (min-width: 1024px) {
    display: none !important;
  }
`;
