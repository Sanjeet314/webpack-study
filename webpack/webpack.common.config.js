const path = require("path"); //we are going to need this module while specifying output settings
/**
 * this part we are doing by ourself <script src="./dist/main.f5d09a84472b.js"></script> after generating bundles, there is special plugin that can update during build process this plugin is called html webpack plugin it can create html file from scratch so we dont have to worry about that anymore since we 
  are going to automatically generate html both for production and developement builds I can add this plugin to files with common webpack configuration
 */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
  // output paths are generated inside the directory specified by the output.path option (mentined in webpack common cofig), in general webpack can create multiple css bundles, however if you have only one entry point and only one output bundle this can be static name
  // if you need to genrate multiple bundles via multiple entry points then we can use varioue file name subsititution (made by webpack as standard)
  //untill now we were usning same entry point for both i.e. entry: "./src/js/index.js", for prod and dev now we will use different entry point in prod and dev we will change it and remove from here
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    //clean: true,(clean can be object as well we will see it later) means clean entire ../dist folder first and then genrate the files. else everytime we run webpack commnad it will keep generating new bundle
    //clean: true,
    //dry is helper option when made true it will simply show in cli what will be removed and what will be kept as bundle when trying to rebuild the  project, if we remove this option and say simply kept keep: /\.css/, previous generated bundle of js will be removed and css will be kept
    //clean: true, since we are using clean-webpack-pligin now we can comment out this as it will acheive same
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader", // HtmlWebpackPlugin generate template.html internally so we need it now
          },
        ],
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // everytime we import js file to our project webpack will process that file with babel applying all those transformations to your code
        },
      },
    ],
  },
  //   module: {
  //     rules: [
  //       // this may contain multiple rules each rule is responsible for importing one or more file type
  //       // we will be only one rule and that rule will be targetting only css files
  //       {
  //         test: /\.css$/, // regular expression to target css files only
  //         use: ["style-loader", "css-loader"], //we can combine multiple loader inside single rule cssloader reader the content of css file and simply returns it, after that style loader will come into picture it takes the css and injects it right into the page using styles tag. using style-loader bundles your css together with js giving single resulting file called: bundle.js ==> later we will see how to generate seperate files, till now css will be added in head tag using <style> tag
  //       },
  //     ],
  //   },
  plugins: [
    new HtmlWebpackPlugin({
      // we can specify the name of the file going to be generated (useful in a sense that we can have multiple html file as well)
      filename: "index.html",
      //by default webapck will create simple html file according to its internal template, however it is possible to provide custom template, thats what we are going to do here
      //we can delete our custom index.html now since webpack will generate template.html now and it will be with updated refrences of script and css and its name after build will be index.html bcoz thats what we mentioned just above
      template: "src/template.html",
    }),
    // new CleanWebpackPlugin({
    //   // not only dist cleanup but we can clean other folders as well with this plugin before generating next bundle
    //   cleanOnceBeforeBuildPatterns: [
    //     "**/*", // all folder and its subfolder 0f ===> build/**/* ===> we made it explicitly to test this feature
    //     path.join(process.cwd(), "build/**/*"),
    //   ],
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "images/motivational-pictures/*.*",
        },
      ],
    }),
  ],
};

module.exports = config;
