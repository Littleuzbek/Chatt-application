import React, { Fragment, useState } from "react";
import {
  deleteField,
  doc,
  getDoc,
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
    dispatch(uiActions.setDoubleDelete(false));
    dispatch(chatActions.changeUser(false));
    dispatch(chatActions.setID("null"));

    let userChat = await getDoc(
      doc(db, "userChats", deletingUser[1]?.userInfo.uid),
      { [deletingUser[0]]: deletingUser[0] }
    );

    if (checked) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [deletingUser[0]]: deleteField(deletingUser[0]),
      });

      await updateDoc(doc(db, "userChats", deletingUser[1]?.userInfo.uid), {
        [deletingUser[0]]: deleteField(deletingUser[0]),
      });

      await deleteDoc(doc(db, "chats", deletingUser[0]));
      
    } else {
      if (userChat?.get(deletingUser[0])) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [deletingUser[0]]: deleteField(deletingUser[0]),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [deletingUser[0]]: deleteField(deletingUser[0]),
        });
      }

      await deleteDoc(doc(db, "chats", deletingUser[0]));
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
