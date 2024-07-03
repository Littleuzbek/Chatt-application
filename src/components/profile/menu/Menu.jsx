import React, { Fragment, useEffect, useState } from "react";
import "./Menu.css";
import "./MenuNightMode.css";
import './MenuMini.css'
import Backdrop from "../../UI/Backdrop";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoMoonOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { IoSunnyOutline } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import Settings from "./Settings";
import defaultUser from "../../../images/defaultUser.png";
import EditProfile from "./EditProfile";
import { doc, getDoc } from "firebase/firestore";
import { chatActions } from "../../../redux/ChatSlice";
import { uiActions } from "../../../redux/uiSlice";

export default function Menu() {
  const toggleSettings = useSelector((state) => state.menu.toggleSettings);
  const toggleProfileEdit = useSelector(
    (state) => state.menu.toggleProfileEdit
  );
  const nightMode = useSelector((state) => state.menu.nightMode);
  const [userInfo, setUserInfo] = useState();
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const userData = async () => {
      await getDoc(doc(db, "users", currentUser.uid)).then((res) =>
        setUserInfo(res.data())
      );
    };

    return () => {
      userData();
    };
  }, [currentUser]);

  const ViewContentHandler = (e, type) => {

    dispatch(chatActions.setViewContentValue(e));

    if (document.pictureInPictureElement) {
      document?.exitPictureInPicture();
      dispatch(uiActions.setViewContent(false));
    }

    if (type === "img") {
      dispatch(chatActions.setContentType("Image"));
    }

    setTimeout(() => {
      dispatch(uiActions.setViewContent(true));
    }, 100);
  };

  return (
    <Fragment>
      <Backdrop />
      <div
        className={
          nightMode
            ? toggleProfileEdit
              ? "menuuNight"
              : "menuNight"
            : toggleProfileEdit
            ? "menuu"
            : "menu"
        }
      >
        <div className="userInfo">
          <img
            src={currentUser?.photoURL ? currentUser.photoURL : defaultUser}
            alt=""
            onClick={() =>
              ViewContentHandler(currentUser?.photoURL || null, "img")
            }
          />
          <div>
            <p className="userName">{`Name: ${currentUser?.displayName}`}</p>
            <p className="userName" style={{ fontSize: "16px" }}>
              {userInfo?.username
                ? `Username: ${userInfo?.username}`
                : "No username"}
            </p>
            <p className="userName">
              {`About: ${
                userInfo?.about ? userInfo?.about : `Hi! Let's be friends`
              }`}
            </p>
          </div>
        </div>
        <div className={nightMode ? "optionsNight" : "options"}>
          <div onClick={() => dispatch(menuActions.onSetNewGroup(true))}>
            <LuUsers className="optionBtn" />
            <p>New Group</p>
          </div>
          <div onClick={() => dispatch(menuActions.onSetNewChannel(true))}>
            <HiOutlineSpeakerphone className="optionBtn" />
            <p>New Chanel</p>
          </div>
          <div onClick={() => dispatch(menuActions.onToggleSettings(true))}>
            <IoSettingsOutline className="optionBtn" />
            <p>Settings</p>
          </div>
          <div onClick={() => dispatch(menuActions.onSetNightMode())}>
            {nightMode ? (
              <IoSunnyOutline className="optionBtn" />
            ) : (
              <IoMoonOutline className="optionBtn" />
            )}
            <p>{nightMode ? "Light Mode" : "Night Mode"}</p>
          </div>
          <div
            onClick={() => {
              signOut(auth);
              window.location.reload();
            }}
          >
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
