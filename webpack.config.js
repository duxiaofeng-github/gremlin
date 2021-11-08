const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isProductionEnv = process.env.NODE_ENV === "production";
const isDevelopmentEnv = process.env.NODE_ENV === "development";
const infuraId = process.env.INFURA_ID || "d974d479eadd4dd1a78b7804e6b0000f";
const ipfsHost = process.env.IPFS_HOST || "http://localhost:10098";

module.exports = {
  mode: isDevelopmentEnv ? "development" : "production",
  entry: {
    index: path.resolve(__dirname, "src/index.tsx"),
  },
  output: {
    filename: "[name].[chunkhash:8].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [isDevelopmentEnv && require.resolve("react-refresh/babel")].filter(Boolean),
            },
          },
          {
            loader: "@linaria/webpack-loader", // extract css from js
            options: {
              displayName: isProductionEnv ? false : true,
            },
          },
          {
            loader: "ts-loader", // transform ts to js
            options: {
              allowTsInNodeModules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|jpg|png|woff|woff2?)(\?.+)?$/,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      web3: "web3/dist/web3.min.js",
      "@walletconnect/web3-provider": "@walletconnect/web3-provider/dist/umd/index.min.js",
    },
  },
  watchOptions: {
    poll: 1000,
  },
  devServer: {
    host: "0.0.0.0",
    port: process.env.PROXY || 3000,
    hot: true,
    allowedHosts: "all",
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:8000",
        pathRewrite: { "^/api": "" },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          safari10: true,
          output: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new ReactRefreshPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.tpl",
    }),
    new webpack.DefinePlugin({
      isProduction: JSON.stringify(isProductionEnv),
      isDevelopment: JSON.stringify(isDevelopmentEnv),
      infuraId: JSON.stringify(infuraId),
      ipfsHost: JSON.stringify(ipfsHost),
    }),
  ],
};
