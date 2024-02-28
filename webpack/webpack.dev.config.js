const common = require("./webpack.common.config.js");
const { merge } = require("webpack-merge");
const path = require("path");
const webapck = require("webpack");

//take all common configuratuon and enrich it with additional options
//we can define as many options as we want
//we will use merge(webpack merge) to merge the additional options as well as override if it already defined in common

module.exports = merge(common, {
  entry: "./src/js/index-dev.js", // this contain code that re-render our application everytime our code changes and all this happens without refrehing the page
  mode: "development",
  output: {
    filename: "bundle.js",
    publicPath: "/static/",
  },
  //devtool: "source-map",
  devtool: "eval-source-map",
  devServer: {
    // after installing webpack-dev-server //port where webpack dev server is going to be running, and directory that contains the application files
    port: 9000,
    static: {
      directory: path.resolve(__dirname, "../dist"), // absolute path of application. since we moved webpack config in special folder we need .. to specify the root folder of the project
    },
    devMiddleware: {
      // file that should be considered as index file
      index: "index.html",
      //by default webpack-dev-server generates files in-memory and doesn't save them to disk, in this case your dist folder will be empty empty even though application would be available in your browser(you need to understand this in-memory storing to files concept). But still say you want the files to be present in disk as well so you will have to add property:
      writeToDisk: true,
    },
    client: {
      // this tells webpack-dev-server to show a full screen overlay in the browser when there are compliler errors or warnings
      overlay: true,
    },
    //by default the webpack-dev-server will reload the page when file changes are detected this is needed when you dont use hot-module-reloading feature, however in this course we are going to use hot-module-reloading, this will allow us to get latest changes in the browser without reloading the page ====>>>>> vvvimp hmr can do it without reloading the page no auto refresh  😊
    //therefore we can turnoff liveReload feature
    liveReload: false, //you wont have to build again and againg after you did some change in the code and want to test it.
  },
  module: {
    rules: [
      // this may contain multiple rules each rule is responsible for importing one or more file type
      // we will be only one rule and that rule will be targetting only css files
      {
        test: /\.css$/, // regular expression to target css files only
        exclude: /\.module\.css$/,
        use: ["style-loader", "css-loader"], //we can combine multiple loader inside single rule cssloader reader the content of css file and simply returns it, after that style loader will come into picture it takes the css and injects it right into the page using styles tag. using style-loader bundles your css together with js giving single resulting file called: bundle.js ==> later we will see how to generate seperate files
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]--[md4:hash:7]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, //if less than 10kb webpack will inline the image file as data url else put file in output directory
          },
        },
        generator: {
          filename: "./images/[name][ext]", // keep inside a folder image if image is more than 10kb
        },
      },
    ],
  },
  plugins: [new webapck.HotModuleReplacementPlugin()],
});

//When using webpack-dev-server with Hot Module Replacement (HMR), the page does not fully reload. Instead, HMR allows you to update specific modules at runtime without requiring a complete page refresh
//When a change is detected in a module (e.g., a file like print.js), the HMR runtime notifies webpack.
//Webpack then updates the affected module without a full page reload.
//If the HMR update fails, the entire page will be reloaded.
