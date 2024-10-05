import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import ProgressBar from "../../UI/ProgressBar";
import SoloStatue from "../../../images/soloStatue.jpg";
import { uiActions } from "../../../redux/uiSlice";
import { chatActions } from "../../../redux/ChatSlice";
import MessageContext from "../../OnContextMenu/MessageContext/MessageContext";

const Message = lazy(() => import("./Message"));

export default function Messages({ progressVal, onProgress }) {
  const [messages, setMessages] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messagesId, setMessagesId] = useState();
  const rightClick = useSelector((state) => state.ui.messageClick);
  const user = useSelector((state) => state.chat.user);
  const chatId = useSelector((state) => state.chat.chatId);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    const ID = user.type === "user" ? chatId : user.value.uid;
    try {
      const unSub = onSnapshot(doc(db, "chats", ID), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
        doc.exists() && dispatch(chatActions.setMessages(doc.data().messages));
      });

      return () => {
        unSub();
      };
    } catch (err) {
      console.log(err);
    }
  }, [chatId, user, dispatch]);

  useEffect(() => {
    if (progressVal === 100) {
      setTimeout(() => {
        onProgress(null);
      }, 100);
    }
  }, [progressVal, onProgress]);

  const getPositionHandler = (e, user) => {
    e.preventDefault();

    setMessagesId(user);
    if (e?.clientX) {
      setPosition(() => ({ x: e.clientX + 20, y: e.clientY }));
    } else {
      setPosition(() => ({
        x: e?.touches[0]?.clientX + 20,
        y: e?.touches[0]?.clientY,
      }));
    }
    dispatch(
      uiActions.setClickValue({
        type: "message",
        value: true,
      })
    );
  };

  return (
    <div className="messages">
      {messages?.map((m) => (
        <Suspense fallback={"..."} key={m?.id}>
          <Message message={m} key={m?.id} onContextMenu={getPositionHandler} />
        </Suspense>
      ))}
      {progressVal && (
        <div className="unloaded">
          <img src={currentUser?.photoURL} alt="" />
          <img src={SoloStatue} alt="" />
          <ProgressBar progress={progressVal} />
        </div>
      )}
      {rightClick && (
        <MessageContext
          leftVal={position.x}
          topVal={position.y}
          messagesId={messagesId}
        />
      )}
    </div>
  );
}
