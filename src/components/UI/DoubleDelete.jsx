import React, { Fragment, useEffect, useState } from "react";
import {
  deleteField,
  doc,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./DoubleDelete.css";
import Backdrop from "./Backdrop";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../redux/ChatSlice";
import { uiActions } from "../../redux/uiSlice";

export default function DoubleDelete() {
  const [checked, setChecked] = useState(false);
  const [newAdmin, setNewAdmin] = useState('');
  const [stopLoop, setStop] = useState(true);
  const deletingChat = useSelector((state) => state.chat.deletingChat);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    if (stopLoop) {
      if (deletingChat?.info?.admin === currentUser.uid) {
        for (let i = 0; i < deletingChat?.members?.length; i++) {
          if (deletingChat.members[i].uid !== currentUser.uid) {
            setStop(false)
            setNewAdmin(deletingChat.members[i].uid)
          }
        }
      }
    }
  }, [deletingChat,stopLoop,currentUser.uid]);

  const DeleteChat = async () => {
    if (deletingChat.type === "user") {
      const userId = deletingChat?.info?.uid;
      const combinedId = deletingChat?.chatId;
      dispatch(uiActions.setDoubleDelete(false));
      dispatch(chatActions.changeUser(false));

      if (checked) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: deleteField(combinedId),
        });

        await updateDoc(doc(db, "userChats", userId), {
          [combinedId]: deleteField(combinedId),
        });

        await deleteDoc(doc(db, "chats", combinedId));
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: deleteField(combinedId),
        });
      }
      dispatch(chatActions.setChatDeleted());
    }

    if (deletingChat.type === "group" || deletingChat.type === "channel") {
      const groupId = deletingChat?.chatId
      const deletingMember = deletingChat?.members;
      const admin = deletingChat.info.admin === currentUser.uid ? newAdmin : deletingChat.info.admin;
      const collection = deletingChat.type === 'group' ? 'userGroups': 'userChannels';
      const infoType = deletingChat.type === 'group' ? 'groupInfo': 'channelInfo';
      
      for (let i = 0; i < deletingMember?.length; i++) {
        if (deletingMember[i]?.uid !== currentUser.uid) {
          await updateDoc(doc(db, collection, deletingMember[i]?.uid), {
            [groupId + ".members"]: arrayRemove({
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
            }),
            [groupId + `.${infoType}`]: {
              about: deletingChat.info.about,
              admin: admin,
              displayName: deletingChat.info.displayName,
              photoURL: deletingChat.info.photoURL,
              uid: deletingChat.info.uid
            }
          });
        } else {
          await updateDoc(doc(db, collection, currentUser.uid), {
            [groupId]: deleteField(groupId),
          });
        }
      }
      dispatch(uiActions.setDoubleDelete(false));
      dispatch(chatActions.changeUser(false));
      dispatch(chatActions.setChatDeleted());
    }


    setStop(true)
    setNewAdmin('')
  };

  return (
    <Fragment>
      <Backdrop />
      <div className="doubleDelete">
        <div>
          <p>
            You're going to delete everthing about this
            {deletingChat.type === "user"
              ? " user"
              : deletingChat.type === "channel"
              ? " channel"
              : " group"}
            ?
          </p>
          <div
            style={{
              display:
                (deletingChat.type === "group" ||
                  deletingChat.type === "channel") &&
                "none",
            }}
          >
            <input
              type="checkbox"
              onChange={(e) => setChecked(e.target.checked)}
            />
            <p>Also delete for </p>
            <p
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "0 5px",
                borderRadius: "10px",
                fontWeight: "500",
              }}
            >
              {deletingChat?.info?.displayName}
            </p>
          </div>
          <div>
            <button onClick={() => dispatch(uiActions.setDoubleDelete(false))}>
              cancel
            </button>
            <button onClick={() => DeleteChat()}>yes</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
