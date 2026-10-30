const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

module.exports = async () => {
  return mergeConfig(getDefaultConfig(__dirname), {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts.filter(
        (ext) => ext !== "svg",
      )],
      sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
      resolverMainFields: ["react-native", "module", "browser", "main"],
    },
  });
};
