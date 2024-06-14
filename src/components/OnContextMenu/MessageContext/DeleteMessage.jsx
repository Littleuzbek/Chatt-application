import React, { useEffect, useState } from "react";
import "../Oncontext.css";
import { doc, updateDoc, arrayRemove, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useSelector } from "react-redux";

export default function DeleteMessage({ messageId }) {
  const userChatId = useSelector((state) => state.chat.chatId);
  const user = useSelector((state) => state.chat.user);
  const [lastMessage, setLastMesssage] = useState([]);
  const currentUser = auth.currentUser;
  const chatId = user.type === 'user'? userChatId : user.value.uid

  useEffect(() => {
    try {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setLastMesssage(doc.data().messages);
      });

      return () => {
        unSub();
      };
    } catch (err) {
      console.log(err);
    }
  }, [chatId]);

  const DeleteMessage = async () => {
    const beforeMessage = lastMessage?.at(-2)?.text;

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayRemove(messageId),
    });

    if (beforeMessage) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [chatId + ".lastMessage"]: {
          text: lastMessage?.at(-2)?.text,
        },
        [chatId + ".date"]: lastMessage?.at(-2)?.date,
      });
    } else {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [chatId + ".lastMessage"]: {
          text: "",
        },
        [chatId + ".date"]: "",
      });
    }
  };

  return (
    <div  onClick={() => DeleteMessage()}>
      Delete
    </div>
  );
}
