module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.9.0",
      },
    ],
    "@babel/preset-react",
    "@linaria",
  ],
  plugins: ["@babel/plugin-transform-parameters"],
};
