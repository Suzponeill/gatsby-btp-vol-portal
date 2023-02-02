exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        assert: false,
        crypto: false,
        http: false,
        https: false,
        os: false,
        stream: false,
        util: false,
        url: false,
        path: false,
        process: false,
        zlib: false,
        querystring: false,
      },
    },
  });
};
