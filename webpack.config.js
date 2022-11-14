module.exports = {
  entry: {
    script: "./src/assets/js/main.js",
  },
  output: {
    filename: "[name]-min.js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: [["@babel/preset-env", { modules: false }]],
        },
      },
    ],
  },
};
