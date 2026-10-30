// AWS S3 support has been removed. This stub keeps the call sites compiling;
// every operation fails, so uploads/downloads behave as if the network is down.
const disabledError = () => new Error("AWS S3 support has been removed");

const s3 = {
  getSignedUrlPromise: (_operation: string, _params: any): Promise<string> =>
    Promise.reject(disabledError()),
  upload: (_params: any, callback: (err: Error | null, data: any) => void) =>
    callback(disabledError(), null),
};

export default s3;
