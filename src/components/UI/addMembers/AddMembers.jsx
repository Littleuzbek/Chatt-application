import React from "react";
import "./AddMembers.css";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import AddingMembers from "./AddingMembers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";

export default function AddMembers() {
  const [nonMembers, setNonMembers] = useState([]);
  const [existingMembers, setExistingMembers] = useState([]);
  const [lastMessage, setLastMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = async () => {
      if (user.type === "group") {
        onSnapshot(doc(db, "userGroups", currentUser.uid), async (res) => {
          const groups = Object.entries(res.data());
          for (let i = 0; i < groups.length; i++) {
            if (user.value.uid === groups[i][0]) {
              setExistingMembers(groups[i]?.[1]?.members);
              setLastMessage(groups[i]?.[1]?.lastMessage.text);
              // getting users from my list from server
              await getDoc(doc(db, "userChats", currentUser.uid)).then(
                (doc) => {
                  if (doc.data()) {
                    const userList = Object.entries(doc.data());
                    // removing existing members from list
                    const groupMemberIds = new Set(
                      groups[i][1].members.map((member) => member.uid)
                    );
                    const nonMember = userList.filter(
                      (user) => !groupMemberIds.has(user?.[1]?.userInfo?.uid)
                    );
                    // setting filtered list
                    setNonMembers(nonMember);
                  }
                }
              );
            }
          }
        });
      }

      if (user.type === "channel") {
        onSnapshot(doc(db, "userChannels", currentUser.uid), async (res) => {
          const channels = Object.entries(res.data());
          for (let i = 0; i < channels.length; i++) {
            if (user.value.uid === channels[i][0]) {
              setExistingMembers(channels[i]?.[1]?.members);
              setLastMessage(channels[i]?.[1]?.lastMessage.text);
              // getting users from my list from server
              await getDoc(doc(db, "userChats", currentUser.uid)).then(
                (doc) => {
                  if (doc.data()) {
                    const userList = Object.entries(doc.data());
                    // removing existing members from list
                    const channelMemberIds = new Set(
                      channels[i][1].members.map((member) => member.uid)
                    );
                    const nonMember = userList.filter(
                      (user) => !channelMemberIds.has(user?.[1]?.userInfo?.uid)
                    );
                    // setting filtered list
                    setNonMembers(nonMember);
                  }
                }
              );
            }
          }
        });
      }
    };
    currentUser.uid && getChats();
  }, [currentUser.uid, user]);

  const selectHandler = (newUser) => {
    const userExist = selectedUsers?.find((user) => user.uid === newUser.uid);

    if (selectedUsers.length !== 0) {
      if (!userExist) {
        setSelectedUsers([...selectedUsers, newUser]);
      } else {
        // Existing user removed
        const filteredList = selectedUsers.filter((user) => user !== userExist);
        setSelectedUsers([...filteredList]);
      }
    } else {
      setSelectedUsers([newUser]);
    }
  };

  const addToMembers = async () => {
    try {
      setSpinner(true);
      const documentID = user.value.uid;
      const Members = [...existingMembers, ...selectedUsers];
      const collestion = user.type === "group" ? "userGroups" : "userChannels";
      const infoType = user.type === "group" ? "groupInfo" : "channelInfo";

      for (let i = 0; i < Members.length; i++) {
        await updateDoc(doc(db, collestion, Members[i].uid), {
          [documentID + `.${infoType}`]: {
            uid: documentID,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            admin: user?.value?.admin,
            about: user?.value?.about || "",
          },
          [documentID + ".members"]: [...Members],
          [documentID + ".lastMessage"]: {
            text: lastMessage,
          },
          [documentID + ".date"]: serverTimestamp(),
        }).then(() => {
          setSpinner(false);
          setNonMembers([]);
          setSelectedUsers("");
          dispatch(uiActions.setAddMembers(false));
          dispatch(uiActions.setCondition("Added successfully"));
        });
      }
    } catch (err) {
      console.log(err);
      setSpinner(false);
      setSelectedUsers("");
      setNonMembers([]);
      dispatch(uiActions.setAddMembers(false));
      dispatch(
        uiActions.setCondition("Something went wrong! Please try again later")
      );
    }
  };

  return (
    <div className="addMembers">
      <div>
        {nonMembers
          ?.sort((a, b) => b[1].date - a[1].date)
          ?.map(
            (chat) =>
              chat?.[1]?.userInfo && (
                <AddingMembers
                  chat={chat}
                  onSelect={selectHandler}
                  key={chat[0]}
                />
              )
          )}
      </div>
      <div className="addMemberBtn">
        <button
          onClick={() => {
            dispatch(uiActions.setAddMembers(false));
            setSelectedUsers("");
            setNonMembers([]);
          }}
        >
          cancel
        </button>
        <button
          style={
            selectedUsers.length !== 0
              ? { backgroundColor: "black", cursor: "pointer", color: "white" }
              : {}
          }
          onClick={() => {
            return selectedUsers.length !== 0 ? addToMembers() : "";
          }}
        >
          add
        </button>
      </div>
      {spinner && <div className="Loader"></div>}
    </div>
  );
}
