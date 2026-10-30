"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCameraPermission = useCameraPermission;
exports.useMicrophonePermission = useMicrophonePermission;
var _react = require("react");
var _Camera = require("../Camera");
/**
 * Returns whether the user has granted permission to use the Camera, or not.
 *
 * If the user doesn't grant Camera Permission, you cannot use the `<Camera>`.
 *
 * @example
 * ```tsx
 * const { hasPermission, requestPermission } = useCameraPermission()
 *
 * if (!hasPermission) {
 *   return <PermissionScreen onPress={requestPermission} />
 * } else {
 *   return <Camera ... />
 * }
 * ```
 */
function useCameraPermission() {
  const [hasPermission, setHasPermission] = (0, _react.useState)(false);
  const requestPermission = (0, _react.useCallback)(async () => {
    const result = await _Camera.Camera.requestCameraPermission();
    const hasPermissionNow = result === 'granted';
    setHasPermission(hasPermissionNow);
    return hasPermissionNow;
  }, []);
  (0, _react.useEffect)(() => {
    _Camera.Camera.getCameraPermissionStatus().then(s => setHasPermission(s === 'granted'));
  }, []);
  return {
    hasPermission,
    requestPermission
  };
}

/**
 * Returns whether the user has granted permission to use the Microphone, or not.
 *
 * If the user doesn't grant Audio Permission, you can use the `<Camera>` but you cannot
 * record videos with audio (the `audio={..}` prop).
 *
 * @example
 * ```tsx
 * const { hasPermission, requestPermission } = useMicrophonePermission()
 * const canRecordAudio = hasPermission
 *
 * return <Camera video={true} audio={canRecordAudio} />
 * ```
 */
function useMicrophonePermission() {
  const [hasPermission, setHasPermission] = (0, _react.useState)(false);
  const requestPermission = (0, _react.useCallback)(async () => {
    const result = await _Camera.Camera.requestMicrophonePermission();
    const hasPermissionNow = result === 'granted';
    setHasPermission(hasPermissionNow);
    return hasPermissionNow;
  }, []);
  (0, _react.useEffect)(() => {
    _Camera.Camera.getMicrophonePermissionStatus().then(s => setHasPermission(s === 'granted'));
  }, []);
  return {
    hasPermission,
    requestPermission
  };
}
//# sourceMappingURL=useCameraPermission.js.map