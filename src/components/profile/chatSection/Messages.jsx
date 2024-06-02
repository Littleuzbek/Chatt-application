import React, {  Suspense, lazy, useEffect, useState } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import ProgressBar from "../../UI/ProgressBar";
import SoloStatue from "../../../images/soloStatue.jpg";
import { uiActions } from "../../../redux/uiSlice";

const MessageContext = lazy(() => import("../../OnContextMenu/MessageContext"));

export default function Messages({ progressVal, onProgress }) {
  const [messages, setMessages] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messagesId, setMessagesId] = useState();
  const rightClick = useSelector(state=>state.ui.messageClick)
  const user = useSelector((state) => state.chat.user);
  const chatId = useSelector((state) => state.chat.chatId);
  const dispatch = useDispatch()

  useEffect(() => {
    const ID = user.type === 'user' ? chatId : user.value.uid;
    try {
        const unSub = onSnapshot(doc(db, "chats", ID), (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        });
        
        return () => {
          unSub();
        };
    } catch (err) {
      console.log(err);
    }
  }, [chatId,user]);

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
    setPosition(() => ({ x: e.clientX, y: e.clientY }));
    dispatch(uiActions.setClickValue({
      type: 'message',
      value: true
    }))
  };

  document.onclick = () => {
    dispatch(uiActions.setClickValue({
      type: 'message',
      value: false
    }))
  };

  return (
    <div className="messages">
      {messages?.map((m) => (
        <Message message={m} key={m?.id} onContextMenu={getPositionHandler} />
      ))}
      {progressVal && (
        <div className="unloaded">
          <img src="" alt="" />
          <img src={SoloStatue} alt="" />
          <ProgressBar progress={progressVal} />
        </div>
      )}
      <Suspense>
        {rightClick && (
          <MessageContext
          leftVal={position.x}
          topVal={position.y}
          messagesId={messagesId}
          />
          )}
      </Suspense>
    </div>
  );
}
