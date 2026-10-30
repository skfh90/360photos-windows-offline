/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react/display-name */
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, StyleProp, ViewStyle, FlatList, Image } from "react-native";
import { useSelector } from "react-redux";
/**
 * ? Local Imports
 */
// import createStyles from "./MyPhotospheresItem.style";
// import { IMyPhotospheresItem } from "@services/models";

import { ScreenWidth } from "@freakycoder/react-native-helpers";
import PhotosphereItem, { IPhotosphereItemRef } from "./PhotosphereItem";
import { getData, sleep } from "../../../shared/utils";
import axios from "axios";
import { API_URL, IMAGE_URL } from "@shared-constants";
import { useHistoryManager } from "../../../hooks/useHistoryManager";
import {
  downloadPhotosphere,
  uploadPhotosphere,
} from "../../../shared/utils/aws";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IMyPhotospheresItemProps {
  style?: CustomStyleProp;
  //   data: IMyPhotospheresItem;
  toggleModal: () => void;
  toggleRenameModal: (text: string) => void;
  setShowAppLoading: (show: boolean) => void;
  setShowBlurView: (show: boolean) => void;
  setAppLoadingText: (text: string) => void;
  showToast: (text: string) => void;
}

export interface IMyPhotospheresItemRef {
  addItem: (item: any) => void;
  refetch: () => void;
  rename: (text: string) => void;
  changeStatus: (item: any) => void;
  syncWithServer: () => void;
}

const MyPhotospheresItem = forwardRef<
  IMyPhotospheresItemRef,
  IMyPhotospheresItemProps
>(
  (
    {
      setShowBlurView,
      setShowAppLoading,
      showToast,
      setAppLoadingText,
      toggleRenameModal,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);
    const [histories, setHistories] = useState<any>(undefined);

    const photosphereItemRefs = useRef<(IPhotosphereItemRef | null)[]>([]);
    const [completedIndexes, setCompletedIndexes] = useState<string[]>([]);
    //   const styles = useMemo(() => createStyles(theme), [theme]);

    //   const { name, description, language, star, fork } = data;

    const { user, isAuthenticated } = useSelector(
      (state: any) => state.authJwt,
    );

    const {
      histories: allHistories,
      addHistory,
      deleteHistory,
      updateHistoryName,
    } = useHistoryManager(user?.id);

    const oldHistories = useRef<any>(null);

    useEffect(() => {
      const download = async () => {
        console.log("[count of images] ==> ", allHistories.length);
        console.log("allHistories = ", allHistories);
        for (let index = 0; index < allHistories.length; index++) {
          try {
            const item: any = allHistories[index];
            if (item?.status <= 0 || item?.status >= 4) continue;
  
            // console.log("[dowloading file] ==> ", index);
            await downloadPhotosphere(item);
            // console.log("completed index => ", item._id);
            setCompletedIndexes((indexes) => [...indexes, item._id.toString()]);
          } catch (error) {
            
          }         
        }
      };
      // download();
      if (allHistories != oldHistories.current) {
        oldHistories.current = allHistories;
        download();
      }
    }, [allHistories]);

    const sampleHistories = useMemo(() => {
      return [
        {
          name: "Cliff Edge Main",
          path: "",
          // eslint-disable-next-line camelcase
          no: -1,
          status: 2,
          type: 0,
          filepath: "demo_cliff_edge",
          fov: "",
          item_order: 0,
          user_id: -1,
        },
        {
          name: "Holland Main",
          path: "",
          // eslint-disable-next-line camelcase
          no: -2,
          status: 2,
          type: 0,
          filepath: "demo_holland_main",
          fov: "",
          item_order: 0,
          user_id: -1,
        },
        {
          name: "Holland Out",
          path: "",
          // eslint-disable-next-line camelcase
          no: -3,
          status: 2,
          type: 0,
          filepath: "demo_holland_out",
          fov: "",
          item_order: 0,
          user_id: -1,
        },
      ];
    }, []);

    // useEffect(() => {
    //   setHistories(allHistories);
    // }, [allHistories])

    const syncSampleDB = async () => {
      console.log("allHistories = ", allHistories);
      if (allHistories.length == 0) {
        console.log("addHistory");
        for (let index = 0; index < sampleHistories.length; index++) {
          const item = sampleHistories[index];
          console.log(item);
          addHistory(
            -1,
            item.filepath,
            item.fov,
            item.item_order,
            item.name,
            item.no,
            item.path,
            item.status,
            item.type,
          );
        }
      }
    };

    useEffect(() => {
      // syncSampleDB();
    }, []);

    const onInit = async () => {
      console.log("onInit");
      try {
        setLoading(true);
        // await sleep(1000);
        console.log("allHistories = ", allHistories);
        if (allHistories.length >= 0) {
          const accessToken = await getData("accessToken");
          console.log(accessToken);
          const res: any = await axios.post(
            `${API_URL}/setup/allhistory`,
            {
              // eslint-disable-next-line camelcase
              user_id: user.id,
            },
            {
              headers: {
                Authorization: accessToken,
              },
            },
          );
          console.log(res.status);

          if (res.status == 200) {
            const { histories: serverHistories } = res.data;
            console.log("serverHistories = ", serverHistories);
            // for (let index = 0; index < sampleHistories.length; index++) {
            //   const item = sampleHistories[index];
            //   addHistory(
            //     -1,
            //     item.filepath,
            //     item.fov,
            //     item.item_order,
            //     item.name,
            //     item.no,
            //     item.path,
            //     item.status,
            //     item.type,
            //   );
            //   // await downloadPhotosphere(item);
            // }
            if (serverHistories != undefined) {
              serverHistories.forEach((subItem: any) => {
                addHistory(
                  subItem.user_id,
                  subItem.filepath,
                  subItem.fov,
                  subItem.item_order,
                  subItem.name,
                  subItem.no,
                  subItem.path,
                  subItem.status,
                  subItem.type,
                );
              });
            }
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log("err => ", err);
        setLoading(false);
      }

      // setHistories([...allHistories, ...sampleHistories]);
    };

    const syncWithServer = useCallback(async () => {
      console.log("sync with server");
      if (isAuthenticated && user?.id && histories) {
        try {
          const accessToken = await getData("accessToken");

          const res: any = await axios.post(
            `${API_URL}/setup/allhistory`,
            {
              // eslint-disable-next-line camelcase
              user_id: user.id,
            },
            {
              headers: {
                Authorization: accessToken,
              },
            },
          );

          if (res.status == 200) {
            const { histories: newHistories } = res.data;
            if (newHistories != undefined) {
              let oldHistories = histories;

              oldHistories = oldHistories.filter(
                (item: any) => item.status != 0,
              );

              const oldExistingIds = new Set(
                oldHistories.map((item: any) => item.no),
              );

              const newExistingIds = new Set(
                newHistories.map((item: any) => item.no),
              );

              newExistingIds.add(-1);
              newExistingIds.add(-2);
              newExistingIds.add(-3);

              if (newExistingIds.size != oldExistingIds.size) {
                console.log("set new histories");

                const newItems = newHistories.filter(
                  (newItem: any) => !oldExistingIds.has(newItem.no),
                );

                oldHistories = oldHistories.concat(newItems);
                oldHistories = oldHistories.filter((item: any) =>
                  newExistingIds.has(item.no),
                );

                oldHistories.sort(
                  (a: any, b: any) => b.timestamp - a.timestamp,
                );

                // oldHistories = oldHistories.filter((item: any) =>
                //   existingIds.has(item.id),
                // );

                setHistories(oldHistories);

                console.log("syncing finished");
              }
            }
          }
        } catch (e) {
          console.log("error ", e);
        }
      }
    }, [isAuthenticated, user?.id, histories]);

    useEffect(() => {
      if (isAuthenticated && user?.id) {
        // onInit();
      }
    }, [isAuthenticated, user?.id]);

    const renameItemInUI = (item: any, name: string) => {
      const newHistories = histories.map((history: any) => {
        if (history.no === item.no) {
          return { ...history, name: name };
        }
        return history;
      });
      setHistories(newHistories);
    };

    const deleteItem = (item: any) => {
      const newHistories = histories.filter(
        (history: any) => item.no !== history.no,
      );
      setHistories(newHistories);
      console.log("delete successfully");
    };

    useImperativeHandle(ref, () => ({
      refetch: () => {
        // onInit();
      },
      rename: (text: string) => {
        const photosphereItemRef =
          photosphereItemRefs.current[indexRef.current];

        if (photosphereItemRef) {
          // Access the methods or properties of the specific PhotosphereItem component
          photosphereItemRef.rename(text);
        }
      },
      addItem: (item: any) => {
        console.log("addItem", item);
        if (!histories.map((history: any) => history.no).includes(item.no))
          if (item !== undefined) setHistories([item, ...histories]);
      },
      changeStatus: (item: any) => {
        console.log("changeStatus");

        if (histories.map((history: any) => history.no).includes(item.no)) {
          const newHistories = histories.map((history: any) => {
            if (history.no === item.no) {
              return { ...history, status: item.status };
            }
            return history;
          });

          setHistories(newHistories);
        } else {
          if (item !== undefined) setHistories([item, ...histories]);
        }
        // setHistories((origin: any) => {
        //   const index = origin.findIndex((h: any) => h.no == item.no);
        //   console.log(index)
        //   if (index !== -1) {
        //     origin.shift();
        //   } else {
        //     origin.push(item);
        //   }
        //   return origin;
        // });
      },
      syncWithServer: () => {
        syncWithServer();
      },
    }));

    const selectedItemRef = useRef<any>(null);
    const indexRef = useRef<number>(-1);
    const showRenameModal = (item: any, text: string, index: number) => {
      selectedItemRef.current = item;
      indexRef.current = index;
      toggleRenameModal(text);
    };

    return (
      <View
        style={{
          marginTop: -4.5,
          // flexGrow: 1,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          // zIndex: 100,
          // marginBottom: 70,
        }}
        // showsHorizontalScrollIndicator={false}
      >
        {/* <TouchableOpacity
          style={{
            width: ScreenWidth / 2 - 30,
            height: 78,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
            borderColor: "rgba(0, 19, 10, 0.2)",
            borderRadius: 7,
            marginRight: 5,
            marginLeft: 25,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            //   setOpenPop(true);
            toggleModal();
          }}
        >
          <Svg width={30} height={31} viewBox="0 0 30 31" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.94 16.8V30.96H16.26V16.8H29.7V14.54H16.26V0.5H13.94V14.54H0.5V16.8H13.94Z"
              fill="#00140A"
              fillOpacity="0.25"
            />
          </Svg>
        </TouchableOpacity> */}
        {loading == false &&
          allHistories != null &&
          allHistories.length != 0 && (
            <FlatList
              style={{
                flexGrow: 1,
                width: ScreenWidth - 12,
              }}
              data={allHistories}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <View
                  style={{
                    width: "100%",
                    height: 30,
                  }}
                ></View>
              }
              renderItem={({ item, index }) => (
                <View
                  style={{
                    width: (ScreenWidth - 30) / 2,
                    height: (ScreenWidth - 30) / 4,
                    flexDirection: "column",
                    margin: 4.5,
                  }}
                >
                  <PhotosphereItem
                    deleteItem={deleteItem}
                    onDeleteHistory={deleteHistory}
                    onUpdateName={updateHistoryName}
                    item={item}
                    isLocal={false} // Samples
                    isCompleted={completedIndexes.includes(item._id.toString())}
                    localName={item.name}
                    setAppLoadingText={setAppLoadingText}
                    setShowAppLoading={setShowAppLoading}
                    setShowBlurView={setShowBlurView}
                    renameItemInUI={renameItemInUI}
                    showRenameModal={showRenameModal}
                    showToast={showToast}
                    ref={(ref) => (photosphereItemRefs.current[index] = ref)}
                    index={index}
                    source={`${IMAGE_URL}/uploads/${item.filepath}/thumbnail.jpg`}
                  />
                </View>
              )}
              numColumns={2}
              keyExtractor={(item) => item._id.toString()}
            ></FlatList>
          )}
        {loading && (
          <View
            style={{
              width: ScreenWidth / 2 - 40,
              height: 78,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{
                width: 75,
                height: 75,
              }}
              source={require("../../../assets/landing/360-Loader-400px.gif")}
            />
          </View>
        )}
      </View>
    );
  },
);

export default MyPhotospheresItem;
