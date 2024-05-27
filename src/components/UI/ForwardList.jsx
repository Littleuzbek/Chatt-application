import { Fragment, useEffect, useState } from "react";
import "./ForwardList.css";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Backdrop from "./Backdrop";
import defaultUser from "../../images/defaultUser.png";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import { chatActions } from "../../redux/ChatSlice";

export default function ForwardList() {
  const [chats, setChats] = useState([]);
  const currentUser = auth.currentUser;
  const forwardingMessage = useSelector(state => state.chat.forwardingMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.data()) {
          setChats(doc.data());
        }
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const ForwardHandler = async (forwardingChatId) => {
    const text = forwardingMessage?.text;

    await updateDoc(doc(db, "chats", forwardingChatId), {
      messages: arrayUnion(forwardingMessage),
    });

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [forwardingChatId + ".lastMessage"]: {
        text,
      },
      [forwardingChatId + ".date"]: serverTimestamp(),
    });

    dispatch(chatActions.setForwardingMessage(''))
  };

  return (
    <Fragment>
      <Backdrop />
      <div
        className="forwardList"
        onClick={() => dispatch(uiActions.setForwardList(false))}
      >
        <div >
          {Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <div
                className="forwardingUser"
                key={chat?.[0]}
                onClick={() => {
                  ForwardHandler(chat?.[0]);
                }}
              >
               <img src={chat[1]?.userInfo?.photoURL
                        ? chat[1]?.userInfo?.photoURL
                        : defaultUser} alt="" />
                <div className="forwardingName">
                  <p>{chat[1]?.userInfo?.displayName}</p>
                  <p>Online</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
}
