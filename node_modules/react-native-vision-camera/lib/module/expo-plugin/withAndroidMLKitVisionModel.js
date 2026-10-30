import { AndroidConfig, withAndroidManifest } from '@expo/config-plugins';
const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow
} = AndroidConfig.Manifest;
export const withAndroidMLKitVisionModel = config => {
  return withAndroidManifest(config, conf => {
    const androidManifest = conf.modResults;
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    addMetaDataItemToMainApplication(mainApplication, 'com.google.mlkit.vision.DEPENDENCIES', 'barcode');
    conf.modResults = androidManifest;
    return conf;
  });
};
//# sourceMappingURL=withAndroidMLKitVisionModel.js.map