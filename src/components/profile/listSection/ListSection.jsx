import React, { useEffect, useRef, useState } from "react";
import "./ListSection.css";
import './ListSectionMini.css'
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
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedUser, setSelectedUser] = useState();
  const [timeOff, setTimeOff] = useState(false);
  const rightClick = useSelector((state) => state.ui.listClick);
  const nightMode = useSelector(state => state.menu.nightMode);
  const user = useSelector((state) => state.chat.user);
  const currentUser = auth.currentUser;
  const timeOut = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const getChats = () => {
      const fetchUsers = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          if (doc.data()) {
            setChats(doc.data());
          }
        }
      );

      const fetchGroups = onSnapshot(
        doc(db, "userGroups", currentUser.uid),
        (doc) => {
          const arrr = Object.entries(doc.data());
          if (arrr.length !== 0) {
            setGroups(doc.data());
          } else {
            setGroups([]);
          }
        }
      );

      const fetchChannels = onSnapshot(
        doc(db, "userChannels", currentUser.uid),
        (doc) => {
          if (doc.data()) {
            setChannels(doc.data());
          }
        }
      );
      return () => {
        fetchUsers();
        fetchGroups();
        fetchChannels();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const selectHandler = (user) => {
    dispatch(
      chatActions.changeUser({
        members: user.members,
        value: user.userInfo || user.groupInfo || user.channelInfo,
        type:
          (user.userInfo && "user") ||
          (user.groupInfo && "group") ||
          (user.channelInfo && "channel"),
      })
    );
    dispatch(chatActions.setSelected(true))
  };

  const getPositionHandler = (e, user) => {
    e.preventDefault();

    setSelectedUser({
      chatId: user?.[0],
      info:
        user?.[1]?.channelInfo || user?.[1]?.groupInfo || user?.[1]?.userInfo,
      members: user?.[1]?.members,
      type:
        (user?.[1]?.channelInfo && "channel") ||
        (user?.[1]?.groupInfo && "group") ||
        (user?.[1]?.userInfo && "user"),
    });
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
      }, 1000);
    }

    return () => {
      clearTimeout(timeOut.current);
    };
  }, [dispatch, timeOff, rightClick]);

  const all = Object.entries({
    ...chats,
    ...groups,
    ...channels,
  });

  useEffect(() => {
      if (user?.value?.uid) {
        if(all){
          const selectedChat = all?.find(
            (use) =>
            (use?.[1]?.userInfo?.uid ||
              use?.[1]?.groupInfo?.uid ||
              use?.[1]?.channelInfo?.uid ) === user?.value?.uid
              );

              if (!selectedChat) {
                dispatch(chatActions.changeUser(false));
          }
      }
    }
  }, [user?.value, dispatch,all]);

  return (
    <div className={nightMode? 'ListNight' : "List"}>
      <Search />
      {rightClick && (
        <ListContext
          leftVal={position.x}
          topVal={position.y}
          selectedUser={selectedUser}
          onSetTimeOff={setTimeOff}
        />
      )}
      {all
        ?.sort((a, b) => b[1].date - a[1].date)
        ?.map(
          (chat) =>
            (chat?.[1]?.userInfo ||
              chat?.[1]?.groupInfo ||
              chat?.[1]?.channelInfo) && (
              <User
                chatVal={chat}
                onSelect={selectHandler}
                onGetPosition={getPositionHandler}
                key={chat[0]}
              />
            )
        )}
    </div>
  );
}
