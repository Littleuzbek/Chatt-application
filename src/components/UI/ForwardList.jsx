import {  useEffect, useState } from "react";
import "./ForwardList.css";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import defaultUser from "../../images/defaultUser.png";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import { chatActions } from "../../redux/ChatSlice";

export default function ForwardList() {
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const currentUser = auth.currentUser;
  const forwardingMessage = useSelector(
    (state) => state.chat.forwardingMessage
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.data()) {
          setChats(doc.data());
        }
      });

      const fetch = onSnapshot(
        doc(db, "userGroups", currentUser.uid),
        (doc) => {
          if (doc.data()) {
            setGroups(doc.data());
          }
        }
      );

      return () => {
        unsub();
        fetch();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const ForwardHandler = async (forwardingUser) => {
    try{
      const chatType = forwardingUser?.at(1)?.userInfo ? 'user' : 'group';
      const forwardingChatId = forwardingUser?.at(1)?.userInfo?.uid ? forwardingUser?.at(1).userInfo.uid : forwardingUser?.at(1).groupInfo.uid;
      const members = forwardingUser?.at(1)?.members
      const text = forwardingMessage?.text;
      
      await updateDoc(doc(db, "chats", forwardingUser[0]), {
      messages: arrayUnion(forwardingMessage),
    });

    if(chatType === 'user'){
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [forwardingUser[0] + ".lastMessage"]: {
          text,
        },
        [forwardingUser[0] + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", forwardingChatId), {
        [forwardingUser[0] + ".lastMessage"]: {
          text,
        },
        [forwardingUser[0] + ".date"]: serverTimestamp(),
      });
    }
    
    if(chatType === 'group'){
      await updateDoc(doc(db, "userGroups", currentUser.uid), {
        [forwardingUser[0] + ".lastMessage"]: {
          text,
        },
        [forwardingUser[0] + ".date"]: serverTimestamp(),
      });
      
      for(let i = 0; i < members.length; i++){
        await updateDoc(doc(db, "userGroups", members[i].uid), {
          [forwardingUser[0] + ".lastMessage"]: {
            text,
          },
          [forwardingUser[0] + ".date"]: serverTimestamp(),
        });
      }
    }
    
    dispatch(chatActions.setForwardingMessage(''))
  }catch(err){console.log(err);}
  };

  return (
      <div
        className="forwardList"
        onClick={() => dispatch(uiActions.setForwardList(false))}
      >
        <div>
          {Object.entries(Object.assign(chats, groups))
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <div
                className="forwardingUser"
                key={chat?.[0]}
                onClick={() => {
                  ForwardHandler(chat);
                }}
              >
                <img
                  src={
                    chat[1]?.userInfo?.photoURL || chat[1]?.groupInfo?.photoURL
                      ? chat[1]?.userInfo?.photoURL ||
                        chat[1]?.groupInfo?.photoURL
                      : defaultUser
                  }
                  alt=""
                />
                <div className="forwardingName">
                  <p>
                    {" "}
                    {chat[1]?.userInfo?.displayName ||
                      chat[1]?.groupInfo?.displayName}
                  </p>
                  <p>Online</p>
                </div>
              </div>
            ))}
        </div>
      </div>
  );
}
