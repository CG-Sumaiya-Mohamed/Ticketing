module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300; // Poll for file changes every 300ms (file watching inside containers is unreliable).
    return config;
  },
};
