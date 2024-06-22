import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import defaultUser from "../../../images/defaultUser.png";
import { uiActions } from "../../../redux/uiSlice";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { AiOutlineDelete } from "react-icons/ai";
import { IoPersonAdd } from "react-icons/io5";
import { CgClose } from "react-icons/cg";
import { chatActions } from "../../../redux/ChatSlice";

export default function Header() {
  const [chosenUser, setChosenUser] = useState();
  const [options, setOptions] = useState(false);
  const [timeOff, setTimeOff] = useState(false);
  const [toggleSearche, setToggleSearche] = useState(false);
  const user = useSelector((state) => state.chat.user);
  const messages = useSelector(state=>state.chat.messages);
  const currentUser = auth.currentUser;
  const displayName = user && user?.value.displayName;
  const timeOut = useRef();
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

  useEffect(() => {
    clearTimeout(timeOut.current);

    if (!timeOff) {
      timeOut.current = setTimeout(() => {
        setOptions(false);
      }, 1000);
    }
  }, [options, timeOff]);

  const SearcheHandler =(text)=>{
   const a = messages.filter(m => m.text.toLowerCase() === text.toLowerCase())
    dispatch(chatActions.setSearchResult(a))
  }

  const addMemberHandler =()=>{
    setOptions(false);
    dispatch(uiActions.setAddMembers(true));
  } 
  
  const deleteHandler =()=>{
    if(user.type === 'group'){
      dispatch(uiActions.setDoubleDelete(true))
    }

  }

  return (
    <Fragment>
      <div
        className="header"
        onClick={() => dispatch(uiActions.setAbout(true))}
      >
        <img
          src={chosenUser?.photoURL ? chosenUser?.photoURL : defaultUser}
          alt=""
        />
        <div style={toggleSearche ? {width: '60%'} : {}}>
          <p>{displayName}</p>
          <p>Online</p>
        </div>
        {toggleSearche ? (
          <Fragment>
            <input onClick={(e) => e.stopPropagation()} onKeyUp={(e)=>SearcheHandler(e.target.value)}/>
            <CgClose className="btn" 
            onClick={(e)=>{
              e.stopPropagation();
              setToggleSearche(false)
              dispatch(chatActions.setSearchResult(''));
            }}/>
          </Fragment>
        ) : (
          <IoMdSearch className="btn" onClick={(e)=>{
            e.stopPropagation();
            setToggleSearche(true)
          }}/>
        )}
        <CiMenuKebab
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            setOptions(true);
            dispatch(chatActions.setSearchResult(false))
          }}
        />
      </div>
      {options && (
        <div
          className="headerOption"
          onMouseEnter={() => setTimeOff(true)}
          onMouseLeave={() => {
            setOptions(false);
            setTimeOff(false);
          }}
        >
          {user.type === "group" && (
            <div onClick={()=>{addMemberHandler()}}>
              <IoPersonAdd />
              <p>Add member</p>
            </div>
          )}
          <div onClick={()=> {deleteHandler()}}>
            <AiOutlineDelete />
            <p>{user.type === "user" ? "Delete Chat" : "Leave Group"}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
}
