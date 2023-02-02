exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        tls: false,
        net: false,
        child_process: false,
        url: require.resolve("url/"),
        path: require.resolve("path-browserify"),
        https: false,
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
      },
    },
  });
};

//
