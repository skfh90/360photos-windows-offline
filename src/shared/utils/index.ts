import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.log("storeData error = ", e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) return value;
  } catch (e) {
    // error reading value
    console.log("getData error = ", e);
  }
  return "";
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }

  console.log("Done.");
};

export const getDirectoryPath = () => {
  return RNFS.DocumentDirectoryPath + "/photo";
};

export const deleteFilesInDirectory = (
  directoryPath: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    RNFS.readDir(directoryPath)
      .then((files) => {
        const filePromises = files.map((file) => RNFS.unlink(file.path));
        Promise.all(filePromises)
          .then(() => resolve())
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export const createDirectoryIfNotExists = (
  directoryPath: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    RNFS.exists(directoryPath)
      .then((exist) => {
        if (!exist) {
          RNFS.mkdir(directoryPath)
            .then(() => resolve(false))
            .catch((err) => reject(err));
        } else resolve(true);
      })
      .catch((err) => reject(err));
  });
};

export const createDirectoryAndDeleteAllFiles = async (
  directoryPath: string, isDelete: boolean = true,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    createDirectoryIfNotExists(directoryPath)
      .then((exist) => {
        if (isDelete) {
          deleteFilesInDirectory(directoryPath)
            .then(() => resolve())
            .catch((err) => reject(err));
        } else {
          resolve();
        }

      })
      .catch((err) => reject(err));
  });
};

export const existFileInDirectory = (
  directoryPath: string,
  fileName: string,
  forceDelete: boolean = false,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    RNFS.exists(directoryPath + "/" + fileName)
      .then((value) => {
        if (value) {
          if (forceDelete) {
            deleteFileInDirectory(directoryPath, fileName)
            .then((value) => {
              resolve(true);
            }).catch((e) => reject(e));
          } else {
            resolve(true);
          }
        }
        else resolve(false);
      })
      .catch((e) => reject(e));
  });
};

export const deleteFileInDirectory = (
  directoryPath: string,
  fileName: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    RNFS.unlink(directoryPath + "/" + fileName)
      .then((value) => {
        resolve();
      })
      .catch((e) => resolve());
  });
};

export const Timeout = (time: number) => {
  let controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, time);
  return controller;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const capitalizeFirstLetter = (str: string) => {
  return str && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const getPhotosphereName = (item: any) => {
  let sphereName = "";
  if (item.type == 1) sphereName = item.path;
  else if (item.status == 2) sphereName = "photo360.jpg";
  else sphereName = "error.jpg";

  return sphereName;
};

export const getPanoramaSrcForViewer = (item: any) => {
  return (
    "file://" +
    getDirectoryPath() +
    "/" +
    item.filepath +
    "/" +
    getPhotosphereName(item)
  );
};

export const copyFile = async (sourcePath: string, destinationPath: string) => {
  try {
    const destinationExists = await RNFS.exists(destinationPath);

    // If the file exists, remove it first
    if (destinationExists) {
      await RNFS.unlink(destinationPath);
    }

    // Copy the file from source to destination
    await RNFS.copyFile(sourcePath, destinationPath);

    console.log("File copied successfully!");
  } catch (error) {
    console.log("Error while copying the file:", error);
  }
};
