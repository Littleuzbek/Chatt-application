import React, { Fragment, useEffect, useState } from "react";
import "./Menu.css";
import Backdrop from "../../UI/Backdrop";
import { MdGroup } from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoMoonOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import Settings from "./Settings";
import defaultUser from '../../../images/defaultUser.png'
import EditProfile from "./EditProfile";
import { doc, getDoc } from "firebase/firestore";

export default function Menu() {
  const toggleSettings = useSelector((state) => state.menu.toggleSettings);
  const toggleProfileEdit = useSelector((state) => state.menu.toggleProfileEdit);
  const [userInfo,setUserInfo] = useState()
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  useEffect(()=>{
    const userData = async()=>{
      await getDoc(doc(db,'users',currentUser.uid))
      .then(res=>setUserInfo(res.data()));
    }

    return ()=>{
      userData()
    }
    },[currentUser])

  return (
    <Fragment>
      <Backdrop />
      <div className={toggleProfileEdit? 'menuu' : 'menu'}>
        <div className="userInfo">
          <img src={currentUser.photoURL? currentUser.photoURL : defaultUser}  alt="" />
          <div>
            <p className="userName">
              {`Name: ${currentUser.displayName
                ? currentUser.displayName
                : currentUser.email}`}
            </p>
            <p className="userName">
              {`About: ${userInfo?.about ? userInfo?.about : `Hi! Let's be friends`}`}
            </p>
          </div>
        </div>
        <div className="options">
          <div>
            <MdGroup className="optionBtn" />
            <p>New Group</p>
          </div>
          <div>
            <HiOutlineSpeakerphone className="optionBtn" />
            <p>New Chanel</p>
          </div>
          <div onClick={()=>dispatch(menuActions.onToggleSettings(true))}>
            <IoSettingsOutline className="optionBtn" />
            <p>Settings</p>
          </div>
          <div>
            <IoMoonOutline className="optionBtn" />
            <p>Night Mode</p>
          </div>
          <div onClick={() => {signOut(auth); window.location.reload()}}>
            <CiLogout className="optionBtn" />
            <p>Log Out</p>
          </div>
        </div>
        {toggleSettings && <Settings />}
        {toggleProfileEdit && <EditProfile />}
      </div>
    </Fragment>
  );
}
