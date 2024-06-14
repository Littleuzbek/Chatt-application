import React, { Fragment, useState } from "react";
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
  const deletingChat = useSelector((state) => state.chat.deletingUser);
  const chatType = deletingChat?.[1]?.userInfo ? 'user' : 'group';
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  const DeleteChat = async () => {

    if (chatType === "user") {
      const userUid = deletingChat[1]?.userInfo.uid;
      const combinedId = deletingChat[0];
      dispatch(uiActions.setDoubleDelete(false));
      dispatch(chatActions.changeUser(false));

      if (checked) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: deleteField(combinedId),
        });

        await updateDoc(doc(db, "userChats", userUid), {
          [combinedId]: deleteField(combinedId),
        });

        await deleteDoc(doc(db, "chats", combinedId));
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: deleteField(combinedId),
        });
      }
      dispatch(chatActions.setChatDeleted())
    }

    if (chatType === "group") {
      const groupId = deletingChat?.[1]?.groupInfo?.uid;
      const deletingMember = deletingChat?.[1]?.members;
      dispatch(uiActions.setDoubleDelete(false));
      dispatch(chatActions.changeUser(false));
      
      for (let i = 0; i < deletingMember?.length; i++) {
        if (deletingMember[i]?.uid !== currentUser.uid) {
          await updateDoc(doc(db, "userGroups", deletingMember[i]?.uid), {
            [groupId + ".members"]: arrayRemove({
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
            }),
          });
        } else {
          await updateDoc(doc(db, "userGroups", currentUser.uid), {
            [groupId]: deleteField(groupId),
          });
        }
      }
      dispatch(chatActions.setChatDeleted())
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className="doubleDelete">
        <div>
          <p>
            You're going to delete everthing about this 
            {chatType === "user" ? " user" : " group"}?
          </p>
          <div style={{ display: chatType === "group" && "none" }}>
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
              {deletingChat?.[1]?.userInfo?.displayName}
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
