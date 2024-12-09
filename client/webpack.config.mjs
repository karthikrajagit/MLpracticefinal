import webpack from "webpack";
export default {
    performance: {
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
      hints: "warning",
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
  