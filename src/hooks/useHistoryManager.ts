////////////////////////////////////////////////////////////////////////////
//
// Copyright 2023 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { useCallback } from "react";
import { useQuery, useRealm } from "@realm/react";
import { useSelector } from "react-redux";
import { History } from "../models/history";

/**
 * Provides functions for managing changes to the tasks in the Realm,
 * such as adding, updating, and deleting tasks.
 *
 * @param userId The App user's ID if sync is enabled.
 */
export function useHistoryManager(userId = null) {
  const { user, isAuthenticated } = useSelector((state: any) => state.authJwt);
  const realm = useRealm();
  const histories = useQuery(
    History,
    (collection) =>
      userId
        ? collection
            .filtered("user_id == $0 || user_id == -1", userId)
            .sorted("timestamp", true)
        : collection.filtered("user_id == -1").sorted("timestamp", true),
    [userId],
  );

  const addHistory = useCallback(
    (
      user_id: number,
      filepath: string,
      fov: string,
      item_order: number,
      name: string,
      no: number,
      path: string,
      status: number,
      type: number,
      is_uploaded: boolean = false,
      is_completed: boolean = false,
      timestamp?: Date,
    ) => {
      if (!user_id) {
        return;
      }
      realm.write(() => {
        realm.create(History, {
          user_id,
          filepath,
          fov,
          item_order,
          name,
          no,
          path,
          status,
          timestamp,
          type,
          is_uploaded,
          is_completed,
        });
      });
    },
    [realm],
  );

  /**
   * Deletes a history from the database.
   */
  const deleteHistory = useCallback(
    (history: History) => {
      realm.write(() => {
        realm.delete(history);

        // Alternatively if passing the ID as the argument to handleDeleteTask:
        // realm.delete(realm.objectForPrimaryKey('Task', id));
      });
    },
    [realm],
  );

  const updateHistoryName = useCallback(
    (history: History, newName: any) => {
      realm.write(() => {
        history.name = newName;
      });
    },
    [realm],
  );

  const updateHistoryIsUploaded = useCallback(
    (history: History, isUploaded: any) => {
      realm.write(() => {
        history.is_uploaded = isUploaded;
      });
    },
    [realm],
  );

  return {
    histories,
    addHistory,
    deleteHistory,
    updateHistoryName,
    updateHistoryIsUploaded,
  };
}
