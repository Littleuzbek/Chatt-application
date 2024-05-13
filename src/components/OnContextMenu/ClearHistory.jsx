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
    const userUid = selectedUser[1]?.userInfo?.uid
    const mutualChatId = selectedUser[0];
    dispatch(uiActions.setClickValue({
      type: 'ui',
      value: false
    }))

    await updateDoc(doc(db, "chats", mutualChatId), {
      messages: deleteField(),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [mutualChatId + ".lastMessage"]: {
        text: "",
      },
      [mutualChatId + ".date"]: "",
    });

    await updateDoc(doc(db, "userChats", userUid), {
      [mutualChatId + ".lastMessage"]: {
        text: "",
      },
      [mutualChatId + ".date"]: "",
    });
  };

  return (
    <div className="clearHistory" onClick={()=>clearHistoryHandler()}>
      Clear history
    </div>
  );
}
