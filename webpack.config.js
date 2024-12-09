// webpack.config.js
module.exports = {
    // other configurations
    performance: {
      maxAssetSize: 1000000, // increase the limit
      maxEntrypointSize: 1000000, // increase the limit
      hints: "warning" // or "error" to show an error instead
    },
    // or to specifically address chunk size:
    build: {
      chunkSizeWarningLimit: 1500, // increase this value as per your need
    }
  };
  