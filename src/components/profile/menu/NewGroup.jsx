import { Fragment, useEffect, useRef, useState } from "react";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import Backdrop from "../../UI/Backdrop";
import defaultUser from "../../../images/defaultUser.png";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { LuImagePlus } from "react-icons/lu";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Users from "./Users";
import defaultUsers from "../../../images/defaultUsers.jpg";
import { uiActions } from "../../../redux/uiSlice";

export default function ForwardList() {
  const [chats, setChats] = useState([]);
  const [groupImg, setGroupImg] = useState(false);
  const [imgFile, setImgFile] = useState();
  const [spinner, setSpinner] = useState(false);
  const newGroupMembers = useSelector((state) => state.menu.newGroupMembers);
  const nightMode = useSelector((state) => state.menu.nightMode);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();
  const name = useRef();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.data()) {
          setChats(doc.data());
        }
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const newMemberHandler = (e, type) => {
    try {
      if (type === "add") {
        const userExist = newGroupMembers.find(
          (elem) => elem?.uid === e[1]?.userInfo?.uid
        );
        if (userExist) {
          dispatch(
            menuActions.onSetNewGroupMembers({
              type: "remove",
              value: e[1]?.userInfo,
            })
          );
        } else {
          dispatch(
            menuActions.onSetNewGroupMembers({
              type: "add",
              value: e[1]?.userInfo,
            })
          );
        }
      }

      if (type === "remove") {
        dispatch(
          menuActions.onSetNewGroupMembers({
            type: "remove",
            value: e,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const groupImgHandler = (e) => {
    const imgURL = URL.createObjectURL(e);

    setImgFile(e);
    setGroupImg(imgURL);
  };

  const createGroup = async () => {
    setSpinner(true);
    const groupId = uuid();
    const groupName = name.current.value;
    const storageRef = ref(storage, uuid());
    try {
      await uploadBytesResumable(storageRef, imgFile).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (res) => {
          await updateDoc(doc(db, "userGroups", currentUser.uid), {
            [groupId + ".groupInfo"]: {
              uid: groupId,
              displayName: groupName === "" ? "nameless group" : groupName,
              photoURL: res,
              admin: currentUser.uid,
              about: "",
            },
            [groupId + ".members"]: [
              ...newGroupMembers,
              {
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid,
                admin: currentUser.uid,
              },
            ],
            [groupId + ".lastMessage"]: {
              text: "",
            },
            [groupId + ".date"]: serverTimestamp(),
          })
            .then(async () => {
              dispatch(menuActions.onSetNewGroup(false));
              for (let i = 0; i < newGroupMembers.length; i++) {
                await updateDoc(doc(db, "userGroups", newGroupMembers[i].uid), {
                  [groupId + ".groupInfo"]: {
                    uid: groupId,
                    displayName:
                      groupName === "" ? "nameless group" : groupName,
                    photoURL: res,
                    admin: currentUser.uid,
                    about: "",
                  },
                  [groupId + ".members"]: [
                    ...newGroupMembers,
                    {
                      displayName: currentUser.displayName,
                      photoURL: currentUser.photoURL,
                      uid: currentUser.uid,
                      admin: currentUser.uid,
                    },
                  ],
                  [groupId + ".lastMessage"]: {
                    text: "",
                  },
                  [groupId + ".date"]: serverTimestamp(),
                }).catch((err) => console.log(err));
              }
            })
            .then(() => {
              dispatch(menuActions.onSetNewGroupMembers("clear"));
              setSpinner(false);
            });

          await setDoc(doc(db, "chats", groupId), {});
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className={nightMode ? "newGroupListNight" : "newGroupList"}>
        <div>
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map(
              (chat) =>
                chat?.[1]?.userInfo && (
                  <Users
                    chatVal={chat}
                    onNewMemberHandler={newMemberHandler}
                    key={chat?.[1]?.userInfo?.uid}
                  />
                )
            )}
        </div>
        <div className="chosenMembers">
          <p>Chosen Users</p>
          {newGroupMembers !== "" &&
            newGroupMembers.map((newMember) => (
              <div
                className={nightMode ? `newGroupUserNight ` : `newGroupUser`}
                key={newMember?.uid}
              >
                <img
                  src={newMember?.photoURL ? newMember?.photoURL : defaultUser}
                  alt=""
                />
                <div className="newGroupUserName ">
                  <p>{newMember?.displayName}</p>
                  <p>Online</p>
                </div>
                <CgClose
                  className="removeNewMember"
                  onClick={() => newMemberHandler(newMember, "remove")}
                />
              </div>
            ))}
        </div>
        <div className={nightMode ? "newGroupDetailsNight" : "newGroupDetails"}>
          <p>Details</p>

          <div>
            <p>Group picture</p>
            <img
              src={groupImg ? groupImg : defaultUsers}
              className={groupImg || "miniImg"}
              alt=""
            />
            <input
              type="file"
              name=""
              id="newGroupImg"
              onChange={(e) => {
                if (e?.target?.files[0]?.type.split("/").at(0) !== "image") {
                  dispatch(
                    uiActions.setCondition("Please enter only image file")
                  );
                } else {
                  e?.target?.files[0] && groupImgHandler(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="newGroupImg">
              Upload Picture
              <LuImagePlus />
            </label>
          </div>

          <div>
            <p>Group name</p>
            <input type="text" name="" id="" ref={name} />
          </div>

          {spinner ? (
            <span className="saveORnot">
              <div className="loader"></div>
            </span>
          ) : (
            <button
              style={
                newGroupMembers.length === 0
                  ? {}
                  : nightMode
                  ? {
                      backgroundColor: "white",
                      color: "black",
                      cursor: "pointer",
                    }
                  : {
                      backgroundColor: "black",
                      color: "white",
                      cursor: "pointer",
                    }
              }
              onClick={() => {
                newGroupMembers?.length !== 0 && createGroup();
              }}
            >
              Create
            </button>
          )}
          
          <button
            onClick={() => {
              spinner || dispatch(menuActions.onSetNewGroup(false));
              dispatch(menuActions.onSetNewGroupMembers("clear"));
            }}
          >
           {spinner ? "Waiting" : "Cancel"}
          </button>

          {/* btn for mobile */}
          <div className="newGroupDetailsBtn">
            <button
              onClick={() => {spinner || 
                dispatch(menuActions.onSetNewGroup(false));
                dispatch(menuActions.onSetNewGroupMembers("clear"));
              }}
            >
              {spinner ? "Waiting" : "Cancel"}
            </button>

            {spinner ? (
              <span className="saveORnot">
                <div className="loader"></div>
              </span>
            ) : (
              <button
                style={
                  newGroupMembers.length === 0
                    ? {}
                    : nightMode
                    ? {
                        backgroundColor: "white",
                        color: "black",
                        cursor: "pointer",
                      }
                    : {
                        backgroundColor: "black",
                        color: "white",
                        cursor: "pointer",
                      }
                }
                onClick={() => {
                  newGroupMembers?.length !== 0 && createGroup();
                }}
              >
                Create
              </button>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
