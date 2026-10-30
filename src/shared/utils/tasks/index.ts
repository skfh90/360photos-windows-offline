import { sleep } from "../";
import { uploadPhotosphere } from "../aws";

export const backgroundTask = async () => {
  while (true) {
    await sleep(1000);
  }
};
