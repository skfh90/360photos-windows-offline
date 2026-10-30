import ImageResizer from "@bam.tech/react-native-image-resizer";
import s3 from "./s3";
import { Platform } from "react-native";

import {
  copyFile,
  createDirectoryAndDeleteAllFiles,
  createDirectoryIfNotExists,
  deleteFileInDirectory,
  existFileInDirectory,
  getDirectoryPath,
  getPhotosphereName,
} from ".";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";


const resizeImage = async (
  fileUri: string,
  maxWidth: number,
  maxHeight: number,
  compressFormat: "JPEG" | "PNG",
  quality: number,
): Promise<string> => {
  const resizedImage = await ImageResizer.createResizedImage(
    fileUri,
    maxWidth,
    maxHeight,
    compressFormat,
    quality,
  );
  return resizedImage.uri;
};

const upladImagesToAWS = async (
  dir: string,
  fileUri: string,
  fileName: string,
): Promise<string> => {
  const params = {
    Bucket: "dospace",
    Key: "uploads/" + dir + "/" + fileName,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };
  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: {
        name: fileName,
        type: "image/jpeg",
        uri: fileUri,
      },
    };
    console.log(uploadUrl);
    try {
      await fetch(uploadUrl, options);
      return "success";
    } catch (error) {
      return "error";
    }
  } catch (error) {
    return "error";
  }
};

const uploadImages = async (
  dir: string,
  fileUri: string,
  fileName: string,
): Promise<string> => {
  console.log("upload one");
  let result = await upladImagesToAWS(dir, fileUri, fileName);

  await createDirectoryAndDeleteAllFiles(getDirectoryPath() + "/" + dir);
  let savePath = getDirectoryPath() + "/" + dir + "/" + fileName;

  console.log(fileUri, savePath);
  await copyFile(fileUri, savePath);

  if (result == "error") return "error";

  console.log("resize fileUrl ", fileUri);
  const resizeImageUri = await resizeImage(fileUri, 400, 200, "JPEG", 100);
  console.log("upload two resized fileUrl ", resizeImageUri);
  savePath = getDirectoryPath() + "/" + dir + "/" + "thumbnail.jpg";

  await copyFile(resizeImageUri, savePath);
  console.log(resizeImageUri, savePath);
  result = await upladImagesToAWS(dir, resizeImageUri, "thumbnail.jpg");
  return result;
};

const uploadImageToAWS = (dir: string, fileName: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    existFileInDirectory(getDirectoryPath() + "/" + dir, fileName)
      .then((exist) => {
        if (exist) {
          const params = {
            Bucket: "dospace",
            Key: "uploads/" + dir + "/" + fileName,
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
                body: {
                  name: fileName,
                  type: "image/jpeg",
                  uri:
                    "file://" + getDirectoryPath() + "/" + dir + "/" + fileName,
                },
              };

              fetch(uploadUrl, options)
                .then((res) => {
                  console.log(fileName, " uploading finished");
                  deleteFileInDirectory(
                    getDirectoryPath() + "/" + dir,
                    fileName,
                  )
                    .then(() => {
                      resolve(true);
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((error) => {
              reject(error);
            });
        } else resolve(false);
      })
      .catch((err) => reject(err));
  });
};

const uploadRotText = (dir: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    existFileInDirectory(getDirectoryPath() + "/" + dir, "rot.txt")
      .then((exist) => {
        if (exist) {
          RNFS.readFile(getDirectoryPath() + "/" + dir + "/rot.txt")
            .then((content) => {
              const params = {
                Bucket: "dospace",
                Key: "uploads/" + dir + "/rot.txt",
                Body: content,
                ACL: "public-read",
              };

              s3.upload(params, function (err, data) {
                if (err) {
                  console.log(err);
                  return reject(err);
                }
                console.log(
                  `File uploaded successfully. ${JSON.stringify(data)}`,
                );
                deleteFileInDirectory(getDirectoryPath() + "/" + dir, "rot.txt")
                  .then(() => {
                    resolve(true);
                  })
                  .catch((err) => reject(err));
              });
            })
            .catch((err) => reject(err));
        } else resolve(false);
      })
      .catch((err) => reject(err));
  });
};

const uploadPhotosphere = async (item: any) => {
  let isExisting: boolean = false;
  for (let i = 0; i < 25; i++) {
    try {
      const exist = await uploadImageToAWS(item.filepath, `img_${i}.jpeg`);
      if (exist) isExisting = true;
    } catch (error) {
      console.log("error => ", error);
      return false;
    }
  }
  try {
    isExisting = await uploadRotText(item.filepath);
  } catch (err) {
    console.log("error => ", err);
    return false;
  }
  return isExisting;
};

const downloadPhotosphere = (item: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    downloadImage(item.filepath, getPhotosphereName(item))
      .then((exist) => {
        console.log("[sphereName ==> ]", getPhotosphereName(item));
        downloadImage(item.filepath, "thumbnail.jpg", !exist)
          .then(() => {
            console.log("Photosphere Downloaded Successfully.");
            resolve();
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const downloadImage = (dir: string, fileName: string, forceDeletebeforeUpload: boolean = false): Promise<boolean> => {
  // Main function to download the image

  // setShowAppLoading(true);
  // Getting the extention of the file
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "dospace",
      Key: "uploads/" + dir + "/" + fileName,
    };

    existFileInDirectory(getDirectoryPath() + "/" + dir, fileName, forceDeletebeforeUpload)
      .then((exist) => {
        // if (err) reject(err);
        if (!exist || forceDeletebeforeUpload) {
          createDirectoryIfNotExists(getDirectoryPath() + "/" + dir)
            .then(() => {              
              s3.getSignedUrlPromise("getObject", params)
                .then((url) => {
                  console.log("Your generated pre-signed URL is", url);
                  const path = getDirectoryPath() + "/" + dir + "/" + fileName;
                  console.log("[save path] ==> ", path);

                  const { config } = RNFetchBlob;
                  let options = {};

                  if (Platform.OS == "ios")
                    options = {
                      fileCache: true,
                      path: path,
                      appendExt: "jpg",
                    };
                  else
                    options = {
                      fileCache: true,
                      path: path,
                      appendExt: "jpg",
                    };

                  config(options)
                    .fetch("GET", url)
                    .then(() => {
                      // Showing alert after successful downloading
                      // setShowAppLoading(false);

                      resolve(false);
                    })
                    .catch((e) => reject(e));
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        } else resolve(true);
      })
      .catch((err) => reject(err));
  });
};

export {
  resizeImage,
  upladImagesToAWS,
  uploadImages,
  downloadPhotosphere,
  uploadPhotosphere,
};
