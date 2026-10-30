import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { BlurView } from "@react-native-community/blur";

import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import createStyles from "./CaptureScreen.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { orientationAngle } from "react-native-orientation-angle";
// import Text from "@shared-components/text-wrapper/TextWrapper";
import { useKeepAwake } from "@sayem314/react-native-keep-awake";
import { useNetInfo } from "@react-native-community/netinfo";

import {
  Camera,
  CameraDevice,
  TakePhotoOptions,
  CameraDeviceFormat,
  getCameraFormat,
} from "react-native-vision-camera";
import {
  CAPTURE_STATUS,
  GREEN_TARGET_STATUS,
  waitHoldTime,
  waitCapturingTime,
  SENSOR_INTERVAL,
  UPDATE_RATE,
  FILTER_CAPTURE_ALPHA,
  angleDifference,
  DEBUG,
  rectWid,
  ratio,
  rectHei,
  focusX,
  focusY,
  arrowRadius,
  DEGTORAD,
  focusAdjustTime,
  isPolarIDArrayUltra,
  UPLOAD_TIMEOUT,
  deltaArrowAngle,
  PROCESS_STATUS,
  generateRandomDirName,
} from "./config";

import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
import GuideCircle, { CircleStatus } from "./components/GuideCircle";
import SvgSquareFill from "./Assets/squareFill.svg";
import SvgCircleFill from "./Assets/circleFill.svg";
import SvgArrow from "./Assets/arrow.svg";

import { CameraPoseData } from "./config";
import TranformedGreenTarget, {
  InterfaceTransformedGreenTargetProps,
} from "./components/TransformedGreenTarget";
import * as NavigationService from "react-navigation-helpers";
import { API_URL, SCREENS, getAccessToken } from "@shared-constants";
import { useIsFocused } from "@react-navigation/core";
import { useIsForeground } from "../../hooks/useIsForeground";
import ModalNamePhotosphere, {
  IModalNamePhotosphereRef,
} from "@screens/landing/modal/ModalNamePhotosphere";
import {
  Timeout,
  copyFile,
  createDirectoryIfNotExists,
  deleteFileInDirectory,
  deleteFilesInDirectory,
  getData,
  getDirectoryPath,
  sleep,
} from "../../shared/utils";
import RNFS from "react-native-fs";

import ModalExitWarning, {
  IModalExitWarningRef,
} from "./modal/ModalExitWarning";

import s3 from "../../shared/utils/s3";
import ModalComingSoon, { IModalComingSoonRef } from "./modal/ModalComingSoon";
import AppUploading from "@shared-components/AppUploading";
import EnlargeButton from "@shared-components/EnlargeButton";
import fonts from "@fonts";
import { useHistoryManager } from "../../hooks/useHistoryManager";
import AppLoading from "../../shared/components/AppLoading";


let change = 1;

interface CaptureScreenProps {}

interface IImageFiles {
  id: number;
  rot: number[] | null;
  path: string;
  blob: Blob | null;
  status: number;
}

const CaptureScreen: React.FC<CaptureScreenProps> = () => {
  // const [ toggleModalNewPhotosphere ] = route.params;
  const [cameraPermission, setCameraPermission] = useState<any>();
  const [device, setDevice] = useState<CameraDevice | null>(null);
  const [camFormat, setCamFormat] = useState<CameraDeviceFormat | undefined>(
    undefined,
  );

  const [showRotateText, setShowRotateText] = useState(false);

  const camera = useRef<Camera>(null);

  const [isCameraInitialized, setCameraInitialized] = useState<boolean>(false);
  const [isInPolarZone, setInPolarZone] = useState<boolean>(false);
  const [inFloorCaptureState, setInFloorCaptureState] =
    useState<boolean>(false);
  const targetId = useRef<number>(-1);
  const holdId = useRef<number>(-1);

  const [showAppLoading, setShowAppLoading] = useState(false);
  const [showAppLoadingForUpload, setShowAppLoadingForUpload] = useState(false);
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  // const [dotArray, setDotArray] = useState<GREEN_TARGET_STATUS[]>([]);

  const dotArray = useRef<GREEN_TARGET_STATUS[]>([]);

  const [showSquareFill, setShowSquareFill] = useState<boolean>(false);
  const [showHoldText, setShowHoldText] = useState<boolean>(false);
  const [isCaptureFinished, setCaptureFinished] = useState<boolean>(false);
  // const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);

  const [camFov, setCamFov] = useState<number>(0);

  const [logText, setLogText] = useState<string>("");

  const captureEnableRef = useRef<boolean>(false);
  const layerNameList = useRef<string[]>([]);
  const scrollViewRef = useRef();
  const captureStabled = useRef<boolean>(false);

  const isNetworkStatusGood = useRef<boolean>(true);
  const successedUploadingCount = useRef<number>(0);
  const randomDirName = useRef<string>("");

  const countOfTakenPhotos = useRef<number>(0);
  const imageFiles = useRef<IImageFiles[]>([]);
  const takenIds = useRef<number[]>([]);
  const needCountPhoto = useRef<number>(0);
  const uploadedCountRef = useRef<number>(0);

  const modalNamePhotosphere = useRef<IModalNamePhotosphereRef>(null);
  // const [renameId, setRenameId] = useState<number>(-1);
  const renameIdRef = useRef<number>(-1);
  const holdDeltaAngleRef = useRef<number>(3);

  const [cameraFocused, setCameraFocused] = useState(false);
  const toggleModalNamePhotosphere = () => {
    if (modalNamePhotosphere) modalNamePhotosphere.current?.toggle();
  };

  const modalExitWarning = useRef<IModalExitWarningRef>(null);

  const modalComingSoon = useRef<IModalComingSoonRef>(null);
  const toggleModalComingSoon = () => {
    if (modalComingSoon) modalComingSoon.current?.toggle();
  };

  const [isSuportUltraCamera, setSupportUltraCamera] = useState<boolean | null>(
    null,
  );

  const {
    type: networkType,
    isConnected: networkConnected,
    details: networkDetails,
  } = useNetInfo();

  useEffect(() => {
    if (isSuportUltraCamera == false) {
      toggleModalComingSoon();
    }
  }, [isSuportUltraCamera]);

  const [angleOfArrow, setAngleOfArrow] = useState<number>(0);
  const [isShowArrow, setShowArrow] = useState<boolean>(false);

  const toggleModalExitWarning = () => {
    if (captureEnableRef.current) {
      if (modalExitWarning) modalExitWarning.current?.toggle();
    } else NavigationService.navigate(SCREENS.LANDING);
  };

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const rotTextRef = useRef<string>("");

  const [camPoseChanged, setCamPoseChanged] = useState<boolean>(false);
  const [showBlurView, setShowBlurView] = useState<boolean>(false);
  const [camPose, setCamPose] = useState<CameraPoseData>({
    yaw: 1000,
    pitch: 0,
    roll: 0,
  });

  const camAngleRef = useRef<CameraPoseData>({
    yaw: 1000,
    pitch: 0,
    roll: 0,
  });

  const { user } = useSelector((state: any) => state.authJwt);
  const { addHistory } = useHistoryManager(user?.id);

  useEffect(() => {
    if (isCameraInitialized) {
      // console.log("camera.current", camera.current != null);
      // console.log("device is null? --- ", device != null);
      if (camera.current != null && device != null && device?.supportsFocus) {
        // console.log(focusX, focusY);
        camera.current.focus({
          x: focusX,
          y: focusY,
        });
      }
      setTimeout(async () => {
        // console.log("device is null? --- ", device != null);
        setCameraFocused(true);
        // console.log("Adjusted the focus");
      }, focusAdjustTime);
    }
  }, [device, isCameraInitialized]);

  // const netInfo = useNetInfo();

  useEffect(() => {
    //  setting of sensors...................................................

    orientationAngle.setUpdateInterval(SENSOR_INTERVAL);
    orientationAngle.subscribe((res) => {
      let _camPose = camAngleRef.current;
      if (_camPose.yaw === 1000) {
        _camPose = res;
      }
      const cur_yaw = _camPose.yaw;
      const _yaw = cur_yaw - angleDifference(res.yaw, cur_yaw);
      let filtered_yaw =
        _yaw * FILTER_CAPTURE_ALPHA + (1 - FILTER_CAPTURE_ALPHA) * cur_yaw;

      if (filtered_yaw > 180) filtered_yaw = filtered_yaw - 360;
      else if (filtered_yaw < -180) filtered_yaw = 360 + filtered_yaw;

      const filtered_pitch =
        res.pitch * FILTER_CAPTURE_ALPHA +
        (1 - FILTER_CAPTURE_ALPHA) * _camPose.pitch;
      const filtered_roll =
        res.roll * FILTER_CAPTURE_ALPHA +
        (1 - FILTER_CAPTURE_ALPHA) * _camPose.roll;

      camAngleRef.current = {
        yaw: filtered_yaw,
        pitch: filtered_pitch,
        roll: filtered_roll,
      };
    });
    return () => {
      orientationAngle.unsubscribe();
    };
  }, []);
  const intervalFunc = () => {
    setCamPoseChanged((pose) => !pose);
    // console.log("isCaptureEnable state ........... ", isCaptureEnable);
    // setCamPose(camAngleRef.current);
  };
  useEffect(() => {
    const intervalId = setInterval(intervalFunc, UPDATE_RATE);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //  For arrow ----------------------------------
  useEffect(() => {
    const _camPose = camAngleRef.current;
    const _deltaHold = holdDeltaAngleRef.current;
    let { _id, _holdId } = dotArray.current.reduce(
      (acc, gradient) => {
        const delta_pitch = Math.abs(gradient.pitch - _camPose.pitch);
        const delta_yaw = Math.abs(angleDifference(gradient.yaw, _camPose.yaw));

        // handle minLength
        if (
          gradient.name === "ceiling" || gradient.name === "floor"
            ? acc.minLength > delta_pitch ** 2
            : acc.minLength > delta_pitch ** 2 + delta_yaw ** 2
        ) {
          acc.minLength =
            delta_pitch ** 2 +
            (gradient.name === "ceiling" || gradient.name === "floor"
              ? 0
              : delta_yaw ** 2);
          acc._id = gradient.id;
        }

        // handle _holdId
        if (
          gradient.status != CAPTURE_STATUS.CAPTURED &&
          delta_pitch < _deltaHold &&
          Math.abs(_camPose.roll) < _deltaHold &&
          (gradient.name === "ceiling" || gradient.name === "floor"
            ? true
            : delta_yaw < _deltaHold)
        ) {
          acc._holdId = gradient.id;
        }

        return acc;
      },
      { minLength: 10000, _id: -1, _holdId: -1 },
    );

    if (_id == needCountPhoto.current - 1 && !inFloorCaptureState) {
      _id = -1;
      return;
    }
    if (_holdId == needCountPhoto.current - 1 && !inFloorCaptureState) {
      _holdId = -1;
      return;
    }
    if (targetId.current != _id) {
      targetId.current = _id;
      setInPolarZone(isPolarIDArrayUltra.includes(targetId.current));
    }

    if (captureEnableRef.current == false || !cameraFocused) return;

    if (holdId.current != _holdId) {
      holdId.current = _holdId;
      holdStateChanged();
    }

    // console.log(holdId.current);

    // to draw the arrow --------------------------------------
    for (let index = 0; index < dotArray.current.length; index++) {
      const grad = dotArray.current[index];
      if (
        grad.status !== CAPTURE_STATUS.CAPTURED &&
        Math.abs(grad.pitch - _camPose.pitch) < deltaArrowAngle &&
        (grad.name === "ceiling" || grad.name === "floor"
          ? true
          : Math.abs(angleDifference(grad.yaw, _camPose.yaw)) < deltaArrowAngle)
      ) {
        // not visible arrow
        setShowArrow(false);
        return;
      }
    }

    const { minIdx, minDistance } = dotArray.current.reduce(
      (acc, grad, idx) => {
        if (grad.status !== CAPTURE_STATUS.CAPTURED) {
          let distance = Math.abs(grad.pitch - _camPose.pitch); // for ceiling
          if (grad.name === "floor") {
            distance *= 100;
          } else if (!(grad.name === "ceiling" || grad.name === "floor")) {
            distance += Math.abs(angleDifference(grad.yaw, _camPose.yaw)) * 0.5;
          }

          if (acc.minDistance > distance) {
            return { minDistance: distance, minIdx: idx };
          }
        }
        return acc;
      },
      { minDistance: 1000000, minIdx: -1 },
    );

    if (minIdx > -1) {
      setShowArrow(true);
      const minDot = dotArray.current[minIdx];
      if (minDot?.name === "ceiling") {
        setAngleOfArrow(-90);
      } else if (minDot?.name === "floor") {
        setAngleOfArrow(+90);
      } else {
        setAngleOfArrow(
          Math.atan2(
            -(minDot.pitch - _camPose.pitch) * DEGTORAD,
            -angleDifference(minDot.yaw, _camPose.yaw) * DEGTORAD,
          ) / DEGTORAD,
        );
      }
    }
  }, [camPoseChanged]);

  useEffect(() => {
    if (camFov == 0) return; // neededddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
    // console.log("camFov = ", camFov);
    // if (DEBUG) {
    //   needCountPhoto.current = 10;
    // } else {
    //   needCountPhoto.current = camFov > 90 ? 25 : 36; //25 : 36
    // }
    // needCountPhoto.current = camFov > 90 ? 25 : 36; //25 : 36
    needCountPhoto.current = 1;

    rotTextRef.current = "count: " + needCountPhoto.current + "\n";
    rotTextRef.current = rotTextRef.current + "FOV: " + camFov + "\n";

    imageFiles.current = Array(needCountPhoto.current).fill({
      blob: null,
      id: 0,
      rot: null,
      path: "",
      status: PROCESS_STATUS.INITIAL,
    });

    const initialDotArray: GREEN_TARGET_STATUS[] = [];

    const createDot = (name: string, pitch: number, num: number): void => {
      const deltaAngle = 360 / num;
      for (let i = 0; i < num; i++) {
        initialDotArray.push({
          id: initialDotArray.length,
          name,
          yaw: -180 + (i + 0.5) * deltaAngle,
          pitch,
          status: CAPTURE_STATUS.NOT_CAPTURED,
        });
      }
    };

    layerNameList.current = ["ceiling", "top", "middle", "bottom", "floor"];

    createDot("bottom", -45, 7);
    createDot("middle", 0, 9);
    createDot("top", 45, 7);
    createDot("ceiling", 90, 1);
    createDot("floor", -90, 1);

    dotArray.current = initialDotArray;
  }, [camFov]);

  const setDotStatusById = (dotId: number, status: number): void => {
    const index = dotArray.current.findIndex((item: any) => item.id === dotId);
    if (index !== -1) {
      dotArray.current[index].status = status;
    }
  };

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const holdStateChanged = () => {
    const _hold_id = holdId.current;
    if (_hold_id != -1) {
      setDotStatusById(_hold_id, CAPTURE_STATUS.HOLDING);
      setShowHoldText(true);

      holdDeltaAngleRef.current = 6;
      captureStabled.current = true;
      timerIdRef.current = setTimeout(() => {
        timerIdRef.current = null;
        takePhoto(_hold_id);
      }, waitHoldTime);
    } else {
      captureStabled.current = false;
      setShowHoldText(false);
      setDotStatusById(_hold_id, CAPTURE_STATUS.NOT_CAPTURED);

      holdDeltaAngleRef.current = 3;

      if (timerIdRef.current != null) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    }
  };

  const takePhotoOptions: TakePhotoOptions = useMemo(() => {
    return {
      flash: "off",
      enableShutterSound: false,
      photoCodec: "jpeg",
      qualityPrioritization: "quality",
    };
  }, []);

  // press back button
  useEffect(() => {
    const backAction = () => {
      toggleModalExitWarning();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const uploadOneImageToAWS = useCallback(
    async (id: number, dir: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        imageFiles.current[id]["status"] = PROCESS_STATUS.PROCESSING;
        // sleep(40000).then(() => {
        const obj = imageFiles.current[id];
        const params = {
          Bucket: "dospace",
          Key: "uploads/" + dir + "/" + "img_" + obj.id + ".jpg",
          ContentType: "image/jpeg",
          ACL: "public-read",
        };

        s3.getSignedUrlPromise("putObject", params)
          .then((uploadUrl) => {
            const options = {
              method: "PUT",
              headers: {
                "Content-Type": "image/jpeg",
              },
              body: obj.blob,
            };

            fetch(uploadUrl, options)
              .then((res) => {
                deleteFileInDirectory(
                  getDirectoryPath() + "/" + dir,
                  "img_" + obj.id + ".jpg",
                )
                  .then(() => {
                    console.log("uploaded id = ", id);
                    uploadedCountRef.current += 1;
                    successedUploadingCount.current += 1;
                    imageFiles.current[id]["status"] = PROCESS_STATUS.DONE;
                    resolve();
                  })
                  .catch((err) => {
                    isNetworkStatusGood.current = false;
                    imageFiles.current[id]["status"] = PROCESS_STATUS.FAILED;
                  });
              })
              .catch((err) => {
                isNetworkStatusGood.current = false;
                imageFiles.current[id]["status"] = PROCESS_STATUS.FAILED;
              });
          })
          .catch((error) => {
            isNetworkStatusGood.current = false;
            imageFiles.current[id]["status"] = PROCESS_STATUS.FAILED;
          });
      });
      // });
    },
    [],
  );

  const uploadImagesToAWSFromIds = useCallback(
    async (ids: number[], dir: string): Promise<number[]> => {
      return new Promise((resolve) => {
        let idOfFailed: number[] = [];

        try {
          Promise.all(
            ids.map((id) => {
              return new Promise((subResolve, subReject) => {
                const obj = imageFiles.current[id];
                console.log("id to be upload: ", obj.id);
                const params = {
                  Bucket: "dospace",
                  Key: "uploads/" + dir + "/" + "img_" + obj.id + ".jpg",
                  ContentType: "image/jpeg",
                  ACL: "public-read",
                };

                s3.getSignedUrlPromise("putObject", params)
                  .then((uploadUrl) => {
                    console.log("[uploadUrl] = ", uploadUrl);
                    const options = {
                      method: "PUT",
                      headers: {
                        "Content-Type": "image/jpeg",
                      },
                      body: obj.blob,
                    };

                    fetch(uploadUrl, options)
                      .then((res) => {
                        deleteFileInDirectory(
                          getDirectoryPath() + "/" + dir,
                          "img_" + obj.id + ".jpg",
                        )
                          .then(() => {
                            uploadedCountRef.current += 1;
                            imageFiles.current[id]["status"] =
                              PROCESS_STATUS.DONE;
                            subResolve("success");
                          })
                          .catch((err) => {
                            imageFiles.current[id]["status"] =
                              PROCESS_STATUS.FAILED;
                            subResolve(err);
                          });
                      })
                      .catch((err) => {
                        imageFiles.current[id]["status"] =
                          PROCESS_STATUS.FAILED;
                        subResolve(err);
                      });
                  })
                  .catch((error) => {
                    imageFiles.current[id]["status"] = PROCESS_STATUS.FAILED;
                    subResolve(error);
                  });
              });
            }),
          )
            .then(() => {
              resolve(idOfFailed);
            })
            .catch((err) => {
              resolve(idOfFailed);
            });
        } catch {
          resolve(idOfFailed);
        }
      });
    },
    [],
  );

  const fieldOfViewRef = useRef<number>(0);

  const exitConditionOfUpload = useCallback(() => {
    const idsToBeUpload: number[] = [];
    const processingIds: number[] = [];
    for (let index = 0; index < imageFiles.current.length; index++) {
      const imageFile = imageFiles.current[index];

      if (imageFile.status == PROCESS_STATUS.PROCESSING)
        processingIds.push(index);
      else if (
        imageFile.status == PROCESS_STATUS.FAILED ||
        imageFile.status == PROCESS_STATUS.CAPTURE
      )
        idsToBeUpload.push(index);
    }
    return { idsToBeUpload, processingIds };
  }, []);

  const uploadImagesOneByOne = useCallback(async () => {
    const dir = randomDirName.current;

    const savePath =
      getDirectoryPath() + "/" + randomDirName.current + "/rot.txt";
    try {
      await RNFS.writeFile(savePath, rotTextRef.current, "utf8");
    } catch (error) {
    }

    if (networkConnected && successedUploadingCount.current > 5) {
      while (true) {
        const { idsToBeUpload, processingIds } = exitConditionOfUpload();
        console.log("processing ids in while ", processingIds);
        console.log("ids to be uploaded in while ", idsToBeUpload);
        if (idsToBeUpload.length == 0 && processingIds.length == 0) break;
        if (idsToBeUpload.length != 0)
          await uploadImagesToAWSFromIds(idsToBeUpload, dir);
        else await sleep(1000);
      }

      const params = {
        Bucket: "dospace",
        Key: "uploads/" + dir + "/rot.txt",
        Body: rotTextRef.current,
        ACL: "public-read",
      };

      s3.upload(params, function (err, data) {
        if (err) {
          console.log(err);
        }
        setCaptureFinished(true);

        const info = {
          camFov: camFov.toString(),
          dir: randomDirName.current,
          netStatus: true,
        };
        NavigationService.navigate(SCREENS.LANDING, {
          success: true,
          message: "Successfully uploaded!",
          info: info,
        });
      });
    } else {

      setCaptureFinished(true);
      const info = {
        camFov: camFov.toString(),
        dir: randomDirName.current,
        netStatus: false,
      };
      NavigationService.navigate(SCREENS.LANDING, {
        success: true,
        message: "Uploading Later",
        info: info,
      });
    }
  }, [
    uploadImagesToAWSFromIds,
    exitConditionOfUpload,
    user?.id,
    networkConnected,
    isNetworkStatusGood.current,
    successedUploadingCount.current,
    camFov,
  ]);

  useEffect(() => {
    const createDirectory = async () => {
      randomDirName.current = generateRandomDirName(user.id);
      console.log("generated random dir name ", randomDirName.current);

      await createDirectoryIfNotExists(
        getDirectoryPath() + "/" + randomDirName.current,
      );
      await deleteFilesInDirectory(
        getDirectoryPath() + "/" + randomDirName.current,
      );
    };
    createDirectory();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermissionStatus = await Camera.requestCameraPermission();
        setCameraPermission(cameraPermissionStatus);

        // setLogText("get all available cameras \n");
        let _logText = "";
        const availableDevices = Camera.getAvailableCameraDevices();

        const backDevices = availableDevices.filter(
          (item) => item.position === "back",
        );

        let funnyDevices = backDevices.filter((item) =>
          item.physicalDevices.includes("ultra-wide-angle-camera"),
        );

        if (funnyDevices.length == 0) {
          funnyDevices = backDevices.filter(
            (item) => item.minZoom < 1 || item.isMultiCam === true,
          );
        }

        if (funnyDevices.length == 0) {
          setSupportUltraCamera(true);
          funnyDevices = backDevices;
        } else {
          setSupportUltraCamera(true);
        }

        let maxFieldOfViewDevice: CameraDevice | undefined = undefined;
        let maxFieldOfView = 0;

        funnyDevices.forEach((_device) => {
          if (_device.formats[0].fieldOfView > maxFieldOfView) {
            // _logText += `\nDevice:  ${_device.physicalDevices.join(",")}`;
            maxFieldOfView = _device.formats[0].fieldOfView;
            maxFieldOfViewDevice = _device;
          }
        });

        if (maxFieldOfViewDevice) {
          setDevice(maxFieldOfViewDevice);
          let _camFov = maxFieldOfViewDevice?.formats[0].fieldOfView;

          setCamFov(_camFov);
          fieldOfViewRef.current = _camFov;

          const maxFormat = getCameraFormat(maxFieldOfViewDevice, [
            { photoAspectRatio: 4 / 3 },
            { photoResolution: "max" },
            { videoAspectRatio: 4 / 3 },
            { videoResolution: "max" },
          ]);
          // console.log(maxFormat);

          if (maxFormat) {
            _logText += `\nBest Format : ${maxFormat.photoHeight} x ${maxFormat.photoWidth}
             + (${maxFormat.pixelFormats}) + (${maxFormat.maxFps})`;
            setCamFormat(maxFormat);
          } else {
            _logText += " No Supported Format";
          }
        } else {
          _logText += " No Camera Device";
        }
        // setLogText((text) => text + _logText);
      } catch (error) {
        // setLogText("API VERSION Not Supported " + error);
      }
    })();
  }, []);

  //

  const takePhoto = useCallback(
    async (started_holdID: number) => {
      if (!captureEnableRef.current) return;

      try {
        //Error Handle better
        if (camera.current == null) throw new Error("Camera Ref is Null");
        console.log("Photo taking ....");

        const data = await camera.current.takePhoto(takePhotoOptions);
        const rot = camAngleRef.current;
        let capture_id = holdId.current;
        // console.log("started ----------- ",capture_id);
        if (!captureStabled.current || started_holdID != capture_id) return;

        console.log("captured.........");
        setShowHoldText(false);
        setDotStatusById(capture_id, CAPTURE_STATUS.CAPTURING);

        setShowSquareFill(true);

        setTimeout(() => {
          // play capture sound here....................
          // console.log("--------captured id",capture_id);
          setShowSquareFill(false);
          setDotStatusById(capture_id, CAPTURE_STATUS.CAPTURED);
        }, waitCapturingTime);

        if (takenIds.current.includes(capture_id)) return;
        takenIds.current.push(capture_id);

        const savePath =
          getDirectoryPath() +
          "/" +
          randomDirName.current +
          "/img_" +
          capture_id +
          ".jpeg";

        await copyFile(data.path, savePath);

        const resultData = await fetch(`file://${data.path}`);
        const blobData = await resultData.blob();

        // console.log(savePath);

        if (needCountPhoto.current != 1) {
          capture_id = countOfTakenPhotos.current;
        }

        rotTextRef.current =
          rotTextRef.current +
          capture_id.toString() +
          ", " +
          [rot.yaw, rot.pitch, rot.roll].join(",") +
          "\n";

        imageFiles.current[capture_id] = {
          path: savePath,
          id: capture_id,
          rot: [rot.yaw, rot.pitch, rot.roll],
          blob: blobData,
          status: PROCESS_STATUS.CAPTURE,
        };

        countOfTakenPhotos.current = countOfTakenPhotos.current + 1;
        if (countOfTakenPhotos.current == needCountPhoto.current - 1) {
          setInFloorCaptureState(true);
        }

        if (countOfTakenPhotos.current == needCountPhoto.current) {
          if (networkConnected && successedUploadingCount.current > 5) {
            setShowAppLoadingForUpload(true);
          } else setShowAppLoading(true);
          captureEnableRef.current = false;
        }

        if (countOfTakenPhotos.current == needCountPhoto.current) {
          uploadImagesOneByOne();
        } else {
          if (networkConnected)
            uploadOneImageToAWS(capture_id, randomDirName.current);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [
      device?.supportsFocus,
      takePhotoOptions,
      targetId.current,
      setDotStatusById,
      uploadImagesOneByOne,
      networkConnected,
    ],
  );

  const handleExit = useCallback(() => {
    // imageFiles.current = [];
    NavigationService.navigate(SCREENS.LANDING);
  }, []);

  const getTransformation = (
    grad: GREEN_TARGET_STATUS,
  ): InterfaceTransformedGreenTargetProps => {
    const props: InterfaceTransformedGreenTargetProps = {};
    props.visible = false;
    props.isPolar = false;
    const deltaView = 60;
    const _camPose = camAngleRef.current;
    if (
      (Math.abs(angleDifference(grad.yaw, _camPose.yaw)) < deltaView &&
        Math.abs(grad.pitch - _camPose.pitch) < deltaView) ||
      ((grad.name === "ceiling" || grad.name === "floor") &&
        Math.abs(grad.pitch - _camPose.pitch) < deltaView)
    ) {
      if (
        grad.status === CAPTURE_STATUS.NOT_CAPTURED ||
        grad.status === CAPTURE_STATUS.HOLDING
      ) {
        props.visible = true;
      }
    }

    if (grad.name == "floor") {
      props.visible = props.visible && inFloorCaptureState;
    }

    let translateX = angleDifference(_camPose.yaw, grad.yaw) * 1.6;

    if (grad.name === "ceiling" || grad.name === "floor") {
      translateX = 0;
      props.isPolar = true;
    }

    if (grad.name === "ceiling") {
      props.translateX = 0;
      props.translateY = (-(grad.pitch - _camPose.pitch) * ScreenHeight) / 80;
      props.rotateX = -(grad.pitch - _camPose.pitch);
      props.rotateY = _camPose.roll * 2;
      props.rotateZ = 0;
    } else if (grad.name === "floor") {
      props.translateX = 0;
      props.translateY = (-(grad.pitch - _camPose.pitch) * ScreenHeight) / 80;
      props.rotateX = -(grad.pitch - _camPose.pitch);
      props.rotateY = -_camPose.roll * 2;
      props.rotateZ = 0;
    } else {
      props.translateX = (translateX * ScreenWidth) / 80;
      props.translateY = (-(grad.pitch - _camPose.pitch) * ScreenHeight) / 80;
      props.rotateX = -(grad.pitch - _camPose.pitch);
      props.rotateY = -translateX;
      props.rotateZ = -_camPose.roll;
    }
    // console.log(props)

    return props;
  };

  const getStateOfGuideCircle = useCallback((item: any) => {
    if (item.id != targetId.current) {
      if (item.status == CAPTURE_STATUS.NOT_CAPTURED)
        return CircleStatus.OUTSIDE_NOT_CAPTURED;
      else if (item.status == CAPTURE_STATUS.CAPTURED)
        return CircleStatus.OUTSIDE_CAPTURED;
      else if (item.status == CAPTURE_STATUS.HOLDING)
        return CircleStatus.OUTSIDE_NOT_CAPTURED;
    } else {
      if (item.status == CAPTURE_STATUS.NOT_CAPTURED)
        return CircleStatus.INSIDE_NOT_CAPTURED;
      else if (item.status == CAPTURE_STATUS.CAPTURING)
        return CircleStatus.INSIDE_CAPTURING;
      else if (item.status == CAPTURE_STATUS.HOLDING)
        return CircleStatus.INSIDE_HOLD;
      else if (item.status == CAPTURE_STATUS.CAPTURED)
        return CircleStatus.INSIDE_CAPTURED;
    }
    return CircleStatus.INSIDE_NOT_CAPTURED;
  }, []);

  const onCameraInitialized = useCallback(() => {
    // console.log("camera initialized");
    setCameraInitialized(true);
  }, []);

  useKeepAwake();

  return (
    <View style={styles.container}>
      <View style={styles.cameraViewerStyle}>
        {!isCaptureFinished && device && cameraPermission === "granted" ? (
          <Camera
            ref={camera}
            style={styles.cameraStyle}
            device={device}
            format={camFormat}
            isActive={isActive}
            enableZoomGesture={false}
            enableHighQualityPhotos={true}
            orientation="portrait"
            photo={true}
            video={false}
            audio={false}
            zoom={device.minZoom}
            videoStabilizationMode={"off"}
            onInitialized={onCameraInitialized}
          />
        ) : null}
      </View>

      {isSuportUltraCamera && (
        <View style={styles.viewerStyle}>
          <View style={styles.targetPackStyle}>
            {
              // draw Green targets................
              dotArray.current.map((item, idx) => (
                <TranformedGreenTarget key={idx} {...getTransformation(item)} />
              ))
            }
          </View>

          <View style={styles.whiteCircleAndFrameStyle}>
            {!isShowArrow && isInPolarZone && (
              <View style={styles.circleOutlineStyle} />
            )}
            {!isShowArrow && !isInPolarZone && (
              <View style={styles.rectOutlineStyle} />
            )}
            <View style={styles.centerCircleStyle} />

            {!isInPolarZone && showSquareFill && (
              <SvgSquareFill
                style={styles.targetFillStyle}
                width={rectWid * ratio}
                height={rectHei * ratio}
              />
            )}
            {isInPolarZone && showSquareFill && (
              <SvgCircleFill
                style={styles.targetFillStyle}
                width={rectHei * ratio}
                height={rectHei * ratio}
              />
            )}

            <View style={styles.centerCircleStyle}>
              {showHoldText && (
                <Text style={{ ...styles.holdTextStyle, color: "#000" }}>
                  HOLD
                </Text>
              )}
            </View>

            {captureEnableRef.current && isShowArrow && (
              <View
                style={{
                  position: "absolute",
                  transform: [
                    {
                      translateX:
                        arrowRadius * Math.cos(angleOfArrow * DEGTORAD),
                    },
                    {
                      translateY:
                        arrowRadius * Math.sin(angleOfArrow * DEGTORAD),
                    },
                    { rotateZ: angleOfArrow + 90 + "deg" },
                  ],
                }}
              >
                <SvgArrow />
              </View>
            )}
          </View>

          {captureEnableRef.current && (
            <View style={styles.guidePackStyle}>
              {layerNameList.current.map((str, topIdx) => (
                <View
                  style={{
                    backgroundColor:
                      dotArray.current.find(
                        (item) => item.id == targetId.current,
                      )?.name == str
                        ? "rgba(0, 0, 0, 0.75)"
                        : "transparent",
                    borderRadius: 28,
                    flexDirection: "row",
                    padding: 2,
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                  key={topIdx}
                >
                  {dotArray.current
                    .filter((item: any) => item.name == str)
                    .map((item: any, idx: number) => (
                      <GuideCircle
                        status={getStateOfGuideCircle(item)}
                        key={idx}
                      />
                    ))}
                </View>
              ))}
            </View>
          )}

          <View style={styles.holdFrameStyle}>
            <Text
              color="#FFF"
              fontFamily={
                Platform.OS == "android"
                  ? fonts.azosans.medium
                  : fonts.azosans.bold
              }
              style={styles.holdTextStyle}
            >
              {captureEnableRef.current
                ? targetId.current == dotArray.current.length - 1
                  ? ""
                  : "KEEP PHONE 6 INCHES"
                : "HOLD FRAME"}
            </Text>
            <Text
              color="#FFF"
              fontFamily={
                Platform.OS == "android"
                  ? fonts.azosans.medium
                  : fonts.azosans.bold
              }
              style={styles.holdTextStyle}
            >
              {captureEnableRef.current
                ? targetId.current == dotArray.current.length - 1
                  ? ""
                  : "AWAY FROM CHEST"
                : "OVER GREEN TARGETS"}
            </Text>
          </View>

          {captureEnableRef.current &&
            targetId.current == dotArray.current.length - 1 && (
              <View style={styles.bottomFrameStyle}>
                <Text color="#FFF" style={styles.bottomTextStyle}>
                  STEP OUTSIDE TARGET
                </Text>
              </View>
            )}

          {showRotateText && (
            <View style={styles.holdFrameStyle}>
              <Text color="#FFF" style={styles.holdTextStyle}>
                ROTATE
              </Text>
            </View>
          )}

          {!captureEnableRef.current && (
            <TouchableOpacity
              style={styles.beginButtonStyle}
              onPress={() => {
                console.log("pressed begin button .................");
                captureEnableRef.current = true;
                // uploadImagesOneByOne();
              }}
            >
              <Text color="#FFF" style={styles.beginTextStyle}>
                BEGIN
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.exitButtonStyle}>
            <EnlargeButton
              leftMargin={10}
              topMargin={10}
              butWidth={60}
              normalPath={require("../../assets/close_normal.png")}
              hoverPath={require("../../assets/close_hover.png")}
              isToggleButton={false}
              onPress={() => {
                toggleModalExitWarning();
              }}
            />
          </View>
        </View>
      )}

      {/* {DEBUG && (
        <ScrollView
          style={{
            width: "100%",
            height: ScreenHeight - 100,
            position: "absolute",
          }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <Text
            numberOfLines={100}
            color="red"
            style={{
              fontSize: 24,
            }}
          >
            {networkConnected +
              " " +
              networkType +
              " " +
              JSON.stringify(networkDetails)}
          </Text>
        </ScrollView>
      )} */}

      <ModalNamePhotosphere
        ref={modalNamePhotosphere}
        handleRename={() => {

        }}
        setShowBlurView={setShowBlurView}
      />

      <ModalExitWarning
        ref={modalExitWarning}
        doExit={() => {
          NavigationService.navigate(SCREENS.LANDING);
        }}
        doContinue={() => {}}
      />

      <ModalComingSoon
        ref={modalComingSoon}
        doExit={() => {
          NavigationService.navigate(SCREENS.LANDING);
        }}
      />

      {showAppLoading && (
        <AppLoading showContent={!isCaptureFinished} text={""} />
      )}
      {showAppLoadingForUpload && (
        <AppUploading
          showContent={!isCaptureFinished}
          text={"Uploading Files..."}
          progressText={
            ((uploadedCountRef.current / needCountPhoto.current) * 100).toFixed(
              0,
            ) + "%"
          }
        />
      )}
      {showBlurView && (
        <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 200000000,
          }}
          blurType="dark"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        />
      )}
    </View>
  );
};

export default CaptureScreen;
