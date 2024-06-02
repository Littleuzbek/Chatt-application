import React, { useEffect, useState } from "react";
import "./ListSection.css";
import Search from "../Search/Search";
import { auth, db } from "../../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../../redux/ChatSlice";
import defaultUser from "../../../images/defaultUser.png";
import ListContext from "../../OnContextMenu/ListContext";
import { uiActions } from "../../../redux/uiSlice";

export default function ListSection() {
  const [chats, setChats] = useState([]);
  const [groups,setGroups] = useState([])
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState();
  const rightClick = useSelector((state) => state.ui.listClick);
  const currentUser = auth.currentUser;
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
  }, [currentUser.uid]);

  const handleSelect = (user) => {
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
        })
      );
    }
  };

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

  document.onclick = () => {
    dispatch(
      uiActions.setClickValue({
        type: "list",
        value: false,
      })
    );
  };
  try {
    return (
      <div className="List">
        <Search />
        {rightClick && (
          <ListContext
            leftVal={position.x}
            topVal={position.y}
            selectedUser={selectedUser}
          />
        )}
        {Object.entries(Object.assign(chats,groups))
            ?.sort((a, b) => b[1].date - a[1].date)
            ?.map((chat) => (
              <div
                className="user"
                key={chat[0]}
                onClick={() => handleSelect(chat[1])}
                onContextMenu={(e) => {
                  getPositionHandler(e, chat);
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
                <div className="textSection">
                  <p className="nameOfChat">
                    {chat[1]?.userInfo?.displayName ||
                      chat[1]?.groupInfo?.displayName}
                  </p>
                  <p className="lastMessage">{chat[1]?.lastMessage?.text}</p>
                </div>
              </div>
            ))}
      </div>
    );
  } catch (err) {
    console.log(err);
  }
}
