const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";
const webpack = require("webpack");

module.exports = {
  mode: isDevelopment ? "development" : "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
    chunkFilename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-transform-runtime",
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/, // Exclude CSS Modules
        use: [
          "style-loader", // Injects CSS into the DOM
          "css-loader", // Resolves CSS imports
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // For fonts
        type: "asset/resource", // Webpack 5's built-in asset handling
        generator: {
          filename: "fonts/[name][ext]", // Customize the output directory
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset/resource",
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/public/index.html",
      favicon: "./src/public/favicon.ico",
      minify: !isDevelopment && {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    !isDevelopment &&
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
      }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL
      ),
    }),
  ].filter(Boolean),

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    historyApiFallback: true,
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    open: false,
    hot: false,
    liveReload: false,
    allowedHosts: ['dev.gc-registry.com', 'localhost'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: false,
    webSocketServer: false,
  },

  resolve: {
    extensions: [".js", ".jsx"],
    mainFiles: ['index'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
};
