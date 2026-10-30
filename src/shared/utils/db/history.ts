import { photo360DB } from ".";

export interface IHistory {
  no: number;
  user_id: number;
  path: string;
  type: number;
  timestamp: string;
  name: string;
  status: number;
  filepath: string;
  fov: string;
}

export const getAllHistories = (user_id: number) => {
  const promise = new Promise((resolve, reject) => {
    photo360DB.transaction((tx) => {
      //   tx.executeSql("DROP TABLE transactions", []);
      tx.executeSql(
        "SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC",
        [user_id],
        (tx, results) => {
          const rows = results.rows;
          let histories: IHistory[] = [];

          for (let i = 0; i < rows.length; i++) {
            histories.push({
              ...rows.item(i),
            });
          }

          console.log("histories = ", histories);
          resolve(histories);
        },
      );
    });
  });
  return promise;
};

export const deleteAllHistories = () => {
  const promise = new Promise((resolve, reject) => {
    photo360DB.transaction((tx) => {
      //   tx.executeSql("DROP TABLE transactions", []);
      tx.executeSql("DELETE FROM history", [], (tx, results) => {
        console.log("Results of delete = ", results.rowsAffected);
        resolve();
      });
    });
  });
  return promise;
};

export const insertHistory = (history: IHistory) => {
  const promise = new Promise((resolve, reject) => {
    photo360DB.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO history (user_id, path, type, timestamp, name, status, filepath, fov) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          history.user_id,
          history.path,
          history.type,
          history.timestamp,
          history.name,
          history.status,
          history.filepath,
          history.fov,
        ],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          resolve();
        },
      );
    });
  });
  return promise;
};
