import React, { Fragment, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../../images/defaultUser.png";
import defaultUsers from "../../../images/defaultUsers.jpg";
import { uiActions } from "../../../redux/uiSlice";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPersonAdd } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { FaArrowLeft } from "react-icons/fa6";
import { chatActions } from "../../../redux/ChatSlice";

export default function Header() {
  const [chosenUser, setChosenUser] = useState();
  const [toggleSearche, setToggleSearche] = useState(false);
  const [imgError,setImgError] = useState(false)
  const user = useSelector((state) => state.chat.user);
  const headerMenu = useSelector(state => state.chat.headerMenu);
  const chatId = useSelector((state) => state.chat.chatId);
  const messages = useSelector((state) => state.chat.messages);
  const nightMode = useSelector((state) => state.menu.nightMode);
  const currentUser = auth.currentUser;
  const displayName = user && user?.value.displayName;
  const headerImg = user.type === 'user'? defaultUser : defaultUsers
  const dispatch = useDispatch();

  useEffect(() => {
    const FetchUserData = async () => {
      if (user.type === "user") {
        await getDoc(doc(db, "users", user.value.uid)).then((res) => {
          setChosenUser(res.data());
        });
      }

      if (user.type === "group") {
        setChosenUser(user.value);
      }

      if (user.type === "channel") {
        setChosenUser(user.value);
      }
    };
    user?.value.uid && FetchUserData();
  }, [user, currentUser.uid]);

  const SearcheHandler = (text) => {
    const a = messages.filter(
      (m) => m.text.toLowerCase() === text.toLowerCase()
    );
    dispatch(chatActions.setSearchResult(a));
  };

  const addMemberHandler = () => {
    dispatch(chatActions.setHeaderMenu(false))
    dispatch(uiActions.setAddMembers(true));
  };
  
  const deleteHandler = () => {
    dispatch(
      chatActions.setDeletingChat({
        chatId:
          (user.type === "user" && chatId) ||
          (user.type === "group" && user.value.uid) ||
          (user.type === "channel" && user.value.uid),
        info: user.value,
        members: user.members,
        type: user.type,
      })
    );
    dispatch(uiActions.setDoubleDelete(true));
    dispatch(chatActions.setHeaderMenu(false))
  };

  return (
    <Fragment>
      <div
        className={nightMode ? "headerNight" : "header"}
        onClick={() => {
          dispatch(chatActions.setHeaderMenu(false));
          dispatch(uiActions.setAbout(true));
        }}
          
      >
        <FaArrowLeft
          className="backToChat"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(chatActions.changeUser(false));
            dispatch(chatActions.setSelected(false));
            dispatch(chatActions.setHeaderMenu(false))
          }}
        />
        <img
          src={imgError? headerImg : chosenUser?.photoURL ? chosenUser?.photoURL : headerImg}
          alt=""
          onError={()=>setImgError(true)}
        />
        <div style={toggleSearche ? { width: "60%" } : {}}>
          <p>{displayName}</p>
          <p>Online</p>
        </div>
        {toggleSearche ? (
          <Fragment>
            <input
              onClick={(e) => e.stopPropagation()}
              onKeyUp={(e) => SearcheHandler(e.target.value)}
            />
            <CgClose
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                setToggleSearche(false);
                dispatch(chatActions.setSearchResult(""));
                dispatch(chatActions.setHeaderMenu(false))
               
            }}
            />
          </Fragment>
        ) : (
          <IoMdSearch
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              setToggleSearche(true);
              dispatch(chatActions.setHeaderMenu(false))
              
            }}
          />
        )}
        <CiMenuKebab
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(chatActions.setHeaderMenu(!headerMenu))
            dispatch(chatActions.setSearchResult(false));
            dispatch(
              uiActions.setClickValue({
                type: "list",
                value: false,
              })
            );
            dispatch(
              uiActions.setClickValue({
                type: "message",
                value: false,
              })
            );
          }}
        />
      </div>
      {headerMenu && (
        <div className="headerOption" >
          {(user.type === "group" || user.type === "channel") && (
            <div
              onClick={() => {
                addMemberHandler();
              }}
            >
              <IoPersonAdd />
              <p>Add member</p>
            </div>
          )}
          <div onClick={() => deleteHandler()}>
            <AiOutlineDelete />
            <p>
              {user.type === "user"
                ? "Delete Chat"
                : user.type === "channel"
                ? "Leave Channel"
                : "Leave Group"}
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
}
