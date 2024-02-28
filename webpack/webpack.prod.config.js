const common = require("./webpack.common.config.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(common, {
  entry: "./src/js/index.js",
  output: {
    filename: "js/[name].[contenthash:12].js",
    publicPath: "/static/",
  },
  mode: "production",
  devtool: "source-map",
  //webpack minifies js files in production mode ===> this means by default minimizer array is not empty ==> out of box this array contains only one plugin called "Tursor plugin" and this plugin takes care of minifying the js files ==> however here we have overwritten minizer option and now it has only CssMinimizerPlugin plugin ==> luckily there is way to tell webpack not to override the existing minimizers in webpack 5 we can use special syntax for that ===> `...` this symbol
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
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
      new ImageMinimizerPlugin({
        //using this is adavantage in a sense that, we can optimize images that got copied to dist folder using another plugin as well call CopyWebpack Plugin
        //say we are dealing with dozens of images stored into file system in that case it will be time consuming to refrence those images one by one in your source code, instead you might want to generate refrences programattically, whats more you can store filename into database and get those filename from backend
        //image minimizer plugin allows use to generate image (say of type WebP) as well
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              //these are plugins in itself mentioned below like imagemin-mozjpeg is a plugin
              ["imagemin-mozjpeg", { quality: 40 }],
              [
                "imagemin-pngquant",
                {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
              ],
              ["imagemin-gifsicle", { interlaced: true }],
              [
                "imagemin-svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
        generator: [
          // this config will allow us to genrate webp images inside dist folder out of jpeg images
          {
            type: "asset", //we need specify type as asset as we want to generate image from others plugins in our case CopyWebpack plugin
            preset: "webp-custom-name",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
          },
        ],
      }),
    ],
    //code spliting
    //webapack also allows to put runtime code into seperate js bundle using runtime chunk option
    //by default each entry chunk embeds runtime code.
    //If I specify value, single Webpack will create a single runtime file that will be shared across all
    // generated bundles.
    runtimeChunk: "single",
    splitChunks: {
      // cacheGroups: {
      //   jquery: {
      //     test: /[\\/]node_modules[\\/]jquery[\\/]/,
      //     chunks: "initial", //initial, async or all ===> which chunks will be seleected for optimization. initial means I need only those chunks that will be loaded initially, when your browser start loading your page. initial chunks needs to present in your main html file which contain refrences to your js code and css. async means only those chunks are needed whcich will be loaded asynchronously. all means both you need both aync chunk and initail chunks both are needed
      //     name: "jquery",
      //   },
      //   bootstrap: {
      //     test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
      //     chunks: "initial",
      //     name: "bootstrap",
      //   },
      // },
      //othe way webpack is smart enough to extract libraries to extract
      // chunks: "all",
      // maxSize: 140000, //this will tell webpack to split chunks bigger than the maximum into smaller parts, maxSize is only hint and it could be violated when modules are bigger than the maxSize or resulting chunks will be smaller than the allowed minimum size
      // minSize: 50000,
      // name(module, chunks, cacheGroupKey) {
      //   const filePath = module.identifier();
      //   const filePathAsArray = filePath.split(/[\\/]/); // Use a regex to handle both forward slashes (/) and backslashes (\)
      //   return filePathAsArray[filePathAsArray.length - 1];
      // },
      //one seperate bundle for all nodemodules
      // chunks: "all",
      // maxSize: Infinity, //this will tell webpack to split chunks bigger than the maximum into smaller parts, maxSize is only hint and it could be violated when modules are bigger than the maxSize or resulting chunks will be smaller than the allowed minimum size
      // minSize: 0,
      // cacheGroups: {
      //   node_modules: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: "node_modules",
      //   },
      // },
      //there wont be bundles as equal as presnt inside node_module but webapck is samrt enough it will be generate bundle that your application is using as dependencies only refer package.json dependecies section ==> each and own dependency in its own bundle
      //one imp point in all above and this one strategies borwser will make request only first time, to other subsequent request it will take it from cache of browser
      // chunks: "all",
      // maxSize: Infinity, //this will tell webpack to split chunks bigger than the maximum into smaller parts, maxSize is only hint and it could be violated when modules are bigger than the maxSize or resulting chunks will be smaller than the allowed minimum size
      // minSize: 0,
      // cacheGroups: {
      //   node_modules: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       const packageName = module.context.match(
      //         /[\\/]node_modules[\\/](.*?)([\\/]|$)/
      //       )[1];
      //       return packageName;
      //     },
      //   },
      // },
      chunks: "all", //async in our case can bootstrap library we are trying to load it lazily so bootstrap is example of a asynchronous chunk in our case we can define a cache group for it async chunks as well
      maxSize: Infinity, //this will tell webpack to split chunks bigger than the maximum into smaller parts, maxSize is only hint and it could be violated when modules are bigger than the maxSize or resulting chunks will be smaller than the allowed minimum size
      minSize: 2000,
      cacheGroups: {
        //since we are using jquery asynch--osly. we handled jquery asynchronouldy as well
        // jquery: {
        //   test: /[\\/]node_modules[\\/]jquery[\\/]/,
        //   name: "jquery",
        //   priority: 2,
        // },
        //we commented it now bootstrap will be handled by async group
        // bootstrap: {
        //   test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
        //   name: "bootstrap",
        // },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
          name: "lodash-es",
          priority: 2,
        },
        node_module: {
          test: /[\\/]node_modules[\\/]/,
          name: "node_module",
          chunks: "initial",
        },
        //the upper one will take care of initial chunk and below will be for async chunk
        //dont forget webpack will still generate a seperate bundle for this what what matter is that generate bundle will be loaded aynchrounously
        //browser will make http call to download js bundle required asynchronously here bootstrap
        async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "async",
          name(module, chunks) {
            return chunks.map((chunk) => chunk.name).join("-");
          },
        },
      },
    },
  },
  module: {
    rules: [
      // this may contain multiple rules each rule is responsible for importing one or more file type
      // we will be only one rule and that rule will be targetting only css files
      {
        test: /\.css$/, // regular expression to target css files only
        exclude: /\.module\.css$/, // exclude this from rule and for module.css files we will add seperate rule
        use: [MiniCssExtractPlugin.loader, "css-loader"], // in production we will genrate seperate bundle for css==> we are going to use seperate plugin to extract css into seperate file called minicss extract plugin
        //in order to extract our css into seperate file we need to replace style-loader with loader provided by MiniCssExtractPlugin
      },
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64]",
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
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
          filename: "./images/[name].[contenthash:12][ext]", // keep inside a folder image if image is more than 10kb
        },
        // use: [
        //   {
        //     loader: "image-webpack-loader", // this will optize image size
        //     options: {
        //       mozjpeg: {
        //         quality: 40,
        //       },
        //       pngquant: {
        //         quality: [0.65, 0.9],
        //         speed: 4,
        //       },
        //     },
        //   },
        // ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // a new bundles will generated using this plugin with name style.css
      // output paths are generated inside the directory specified by the output.path option (mentined in webpack common cofig), in general webpack can create multiple css bundles, however if you have only one entry point and only one output bundle this can be static name
      // if you need to genrate multiple bundles via multiple entry points then we can use varioue file name subsititution (made by webpack as standard)
      // in order to give each bundle a unique name
      // by default name of the generated css file will be determeined by the name of the entry point, it is also possible to add contenthash(md4 hash of content generated css file) to the name
      filename: "css/[name].[contenthash:12].css",
      //filename: "style.css",
    }),
    new PurgeCSSPlugin({
      // we downloaded bootstrap but we are using only few features of it, yet the bundle is taking entire bootstrap in consideration, let optimize it using purgecssplugin
      paths: glob.sync(`${path.join(__dirname, "../src")}/**/*`, {
        nodir: true, //dont match the directory but only match the files inside /src folder
      }),
    }),
  ],
});
