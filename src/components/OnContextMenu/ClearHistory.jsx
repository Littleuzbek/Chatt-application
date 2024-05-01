import React from "react";
import "./Oncontext.css";
import { useDispatch } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function ClearHistory({ selectedUser }) {
  const currentUser = auth.currentUser
  const dispatch = useDispatch()

  const clearHistoryHandler = async () => {
    dispatch(uiActions.setClickValue({
      type: 'ui',
      value: false
    }))

    await updateDoc(doc(db, "chats", selectedUser[0]), {
      messages: deleteField(),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [selectedUser[0] + ".lastMessage"]: {
        text: "",
      },
      [selectedUser[0] + ".date"]: "",
    });
  };

  return (
    <div className="clearHistory" onClick={()=>clearHistoryHandler()}>
      Clear history
    </div>
  );
}
