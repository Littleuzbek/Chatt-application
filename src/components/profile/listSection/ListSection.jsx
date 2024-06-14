import React, { useEffect, useRef, useState } from "react";
import "./ListSection.css";
import Search from "../Search/Search";
import { auth, db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../../redux/ChatSlice";
import ListContext from "../../OnContextMenu/ListContext/ListContext";
import { uiActions } from "../../../redux/uiSlice";
import User from "./User";

export default function ListSection() {
  const [chats, setChats] = useState([]);
  const [groups,setGroups] = useState([])
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState();
  const [timeOff, setTimeOff] = useState(false);
  const rightClick = useSelector((state) => state.ui.listClick);
  const triggerForChatDeleted = useSelector(state => state.chat.chatDeleted);
  const currentUser = auth.currentUser;
  const timeOut = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const getChats = () => {
        const unsub = onSnapshot(
          doc(db, "userChats", currentUser.uid),
          (doc) => {
            if (doc.data()) {
              setChats(doc.data())
            }
          }
        );

        const fetch = onSnapshot(
          doc(db, "userGroups", currentUser.uid),
          (doc) => {
            if (doc.data()) {
              setGroups(doc.data())
            }
          }
        );
        return () => {
          unsub();
          fetch();
        };
      };
      currentUser.uid && getChats();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser.uid,triggerForChatDeleted]);

  const selectHandler = (user)=>{
    if (user?.userInfo) {
      dispatch(
        chatActions.changeUser({
          value: user.userInfo,
          type: "user",
        })
      );
    }
    if (user?.groupInfo) {
      dispatch(
        chatActions.changeUser({
          value: user.groupInfo,
          type: "group",
          members: user.members
        })
      );
    }
  }

  const getPositionHandler = (e, user) => {
    e.preventDefault();

    setSelectedUser(user);
    setPosition(() => ({ x: e.clientX, y: e.clientY }));
    dispatch(
      uiActions.setClickValue({
        type: "list",
        value: true,
      })
    );
  };

  useEffect(() => {
   
    
    if (!timeOff) {
      timeOut.current = setTimeout(() => {
        dispatch(
          uiActions.setClickValue({
            type: "list",
            value: false,
          })
          );
        }, 2000);
      }

      return ()=>{ clearTimeout(timeOut.current);}
      
  }, [dispatch,timeOff,rightClick]);

  try {
    return (
      <div className="List">
        <Search />
        {rightClick && (
          <ListContext
            leftVal={position.x}
            topVal={position.y}
            selectedUser={selectedUser}
            onSetTimeOff={setTimeOff}
          />
        )}
        {Object.entries(Object.assign(chats,groups))
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <User 
              chatVal={chat} 
              onSelect={selectHandler}
              onGetPosition={getPositionHandler}
              key={chat[0]}
              />
            ))}
      </div>
    );
  } catch (err) {
    console.log(err);
  }
}
