const path = require('path');

module.exports = {
  // your other webpack configuration options
//   resolve: {
    // fallback: {
    //   "http": require.resolve("stream-http"),
    // },
    // fallback: {
    //     "http": require.resolve("https-browserify"),
    //   },
      resolve: {
        fallback: {
          "http": false,
          "https": false,
          "util": false,
          "zlib": false,
          "stream": false
        }
      //}
  },
};
