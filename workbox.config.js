// overrides for the caching amount

module.exports = {
    GenerateSW: options => {
      // override GenerateSW config here
      // e.g. options.skipWaiting = true;
      return options;
    },
    InjectManifest: options => {
      // override InjectManifest config here
      // Set cache size override to a maximum of 10MB   
      options.maximumFileSizeToCacheInBytes = 20 * 1024 * 1024;
      return options;
    }
  };
  