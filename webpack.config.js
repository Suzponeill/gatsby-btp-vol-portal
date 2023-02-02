module.export = {
  webpack5: true,
  webpack: (config) => {
    config.resolve = {
      fallback: {
        // fs: false,
        // tls: false,
        // net: false,
        // child_process: false,
        // url: require.resolve("url/"),
        // path: require.resolve("path-browserify"),
        // https: false,
        // util: require.resolve("util/"),
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
    };
  },
};

//
