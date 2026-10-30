import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
import { TB_history } from "./config";
import {
  IHistory,
  deleteAllHistories,
  getAllHistories,
  insertHistory,
} from "./history";

export const photo360DB = SQLite.openDatabase(
  {
    name: "Photo360_1.db",
    location: "default",
    createFromLocation: "~www/Photo360_1.db",
  },
  () => {},
  (error) => {
    console.log("errr ==== ", error);
  },
);

export const initdb = () => {
  const promise = new Promise((resolve, reject) => {
    photo360DB.transaction((tx) => {
      //   tx.executeSql("DROP TABLE transactions", []);
      tx.executeSql("SELECT * FROM history;", [], (tx, results) => {
        const rows = results.rows;
        let users = [];

        for (let i = 0; i < rows.length; i++) {
          users.push({
            ...rows.item(i),
          });
        }

        console.log("users = ", users);
        console.log("length of users = ", users.length);
        resolve;
      });
    });
  });
  return promise;
};

export const syncDBFromServer = async (histories: IHistory[]) => {};
