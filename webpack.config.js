const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');

const TerserPlugin = require("terser-webpack-plugin");

const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ImageminWebpWebpackPlugin()
  ],
  entry: {
    main: "./src/main.js",
    locator: "./src/locator.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  devtool: "nosources-source-map",
  module: {
    rules: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          // Order is last to first
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
    ],
  },
  optimization: {
    minimize: true,  
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin(), "..."],
  },
  externals: {
    google: "google",
  },
};