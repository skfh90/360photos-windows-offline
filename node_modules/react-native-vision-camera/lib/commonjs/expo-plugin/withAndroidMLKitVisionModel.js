"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withAndroidMLKitVisionModel = void 0;
var _configPlugins = require("@expo/config-plugins");
const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow
} = _configPlugins.AndroidConfig.Manifest;
const withAndroidMLKitVisionModel = config => {
  return (0, _configPlugins.withAndroidManifest)(config, conf => {
    const androidManifest = conf.modResults;
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    addMetaDataItemToMainApplication(mainApplication, 'com.google.mlkit.vision.DEPENDENCIES', 'barcode');
    conf.modResults = androidManifest;
    return conf;
  });
};
exports.withAndroidMLKitVisionModel = withAndroidMLKitVisionModel;
//# sourceMappingURL=withAndroidMLKitVisionModel.js.map