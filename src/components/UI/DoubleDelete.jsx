import React, { Fragment, useState } from "react";
import {
  deleteField,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./DoubleDelete.css";
import Backdrop from "./Backdrop";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../redux/ChatSlice";
import { uiActions } from "../../redux/uiSlice";

export default function DoubleDelete() {
  const [checked, setChecked] = useState(false);
  const deletingUser = useSelector((state) => state.chat.deletingUser);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  const DeleteChat = async () => {
    const userUid = deletingUser[1]?.userInfo.uid;
    const mutualChatId = deletingUser[0];
    dispatch(uiActions.setDoubleDelete(false));
    dispatch(chatActions.changeUser(false));
    dispatch(chatActions.setID("null"));

      if (checked) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [mutualChatId]: deleteField(mutualChatId),
      });

      await updateDoc(doc(db, "userChats", userUid), {
        [mutualChatId]: deleteField(mutualChatId),
      });

      await deleteDoc(doc(db, "chats", mutualChatId));
      
    } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [mutualChatId]: deleteField(mutualChatId),
        });
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className="doubleDelete">
        <div>
          <p>You're going to delete everthing about this chat?</p>
          <div>
            <input
              type="checkbox"
              onChange={(e) => setChecked(e.target.checked)}
            />
            <p>Also delete for {"name"}</p>
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
