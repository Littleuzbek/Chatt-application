import React from "react";
import "./AddMembers.css";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import AddingMembers from "./AddingMembers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "../../redux/uiSlice";

export default function AddMembers() {
  const [chats, setChats] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = async () => {
      onSnapshot(doc(db, 'userGroups', currentUser.uid), async(res)=>{
        const groups = Object.entries(res.data());
        for (let i = 0; i < groups.length; i++) {
          if(user.value.uid === groups[i][0]){

            await getDoc(doc(db, "userChats", currentUser.uid)).then((doc) => {
              if (doc.data()) {
          const userList = Object.entries(doc.data());
          // removing existing members from user list
          const groupMemberIds = new Set(
            groups[i][1].members.map((member) => member.uid)
          );
          const nonMembers = userList.filter(
            (user) => !groupMemberIds.has(user?.[1]?.userInfo?.uid)
            );
            
            // setting filtered list
            setChats(nonMembers);
          }
        });
      }
    }
      })
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

  const addToGroupMembers = async () => {
    try {
      setSpinner(true);
      const groupId = user.value.uid;
      const groupMembers = [...user.members, ...selectedUsers];

      for (let i = 0; i < groupMembers.length; i++) {
        await updateDoc(doc(db, "userGroups", groupMembers[i].uid), {
          [groupId + ".groupInfo"]: {
            uid: groupId,
            displayName: user.value.displayName,
            photoURL: user.value.photoURL,
            admin: user?.value?.admin,
            about: "",
          },
          [groupId + ".members"]: [...groupMembers],
          [groupId + ".lastMessage"]: {
            text: "",
          },
          [groupId + ".date"]: serverTimestamp(),
        }).then(() => {
          setSpinner(false);
          setChats([]);
          setSelectedUsers("");
          dispatch(uiActions.setAddMembers(false));
          dispatch(uiActions.setCondition("Added successfully"));
        });
      }
    } catch (err) {
      console.log(err);
      setSpinner(false);
      setSelectedUsers("");
      setChats([]);
      dispatch(uiActions.setAddMembers(false));
      dispatch(
        uiActions.setCondition("Something went wrong! Please try again later")
      );
    }
  };

  return (
    <div className="addMembers">
      <div>
        {chats.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            oops there are no friends left add
          </p>
        ) : (
          ""
        )}
        {chats
          ?.sort((a, b) => b[1].date - a[1].date)
          ?.map((chat) => (
            <AddingMembers chat={chat} onSelect={selectHandler} key={chat[0]} />
          ))}
      </div>
      <div className="addMemberBtn">
        <button
          onClick={() => {
            dispatch(uiActions.setAddMembers(false));
            setSelectedUsers("");
            setChats([]);
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
            return selectedUsers.length !== 0 ? addToGroupMembers() : "";
          }}
        >
          add
        </button>
      </div>
      {spinner && <div className="Loader"></div>}
    </div>
  );
}
