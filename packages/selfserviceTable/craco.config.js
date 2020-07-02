const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const celltypesPath = path.join(__dirname, "../celltypes"); //path added for babel load
module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat[celltypesPath];
      }
      return webpackConfig;
    },
  },
};
