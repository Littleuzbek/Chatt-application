import React from "react";
import { LiaUserEditSolid } from "react-icons/lia";
import { ImImages } from "react-icons/im";
import { AiOutlineDelete } from "react-icons/ai";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { uiActions } from "../../../redux/uiSlice";
import { deleteDoc, doc } from "firebase/firestore";

export default function Settings() {
  const settingsAnimation = useSelector(
    (state) => state.menu.settingsAnimation
  );
  const nightMode = useSelector(state => state.menu.nightMode);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;

  const QuitSettings = () => {
    dispatch(menuActions.onSettingsAnimation("quitSettings"));

    setTimeout(() => {
      dispatch(menuActions.onToggleSettings(false));
      dispatch(menuActions.onSettingsAnimation("settings"));
    }, 510);
  };

  const DeleteCurrentUser = async () => {
    const credit = EmailAuthProvider.credential(
      currentUser.email,
      prompt("Please enter your password")
    );

    reauthenticateWithCredential(currentUser, credit)
      .then(() =>
        deleteUser(currentUser)
          .then(async () => {
            await deleteDoc(doc(db, "users", currentUser.uid)).catch((err) =>
              console.log(err)
            );
            await deleteDoc(doc(db, "userChats", currentUser.uid)).catch(
              (err) => console.log(err)
            );
            dispatch(uiActions.setCondition("Account deleted"));
            window.location.reload();
          })
          .catch((err) => console.log(err.value))
      )
      .catch((err) => console.log(err));
  };

  const OpenEditProfile = () => {
    dispatch(menuActions.onToggleSettings(false));
    dispatch(menuActions.onToggleProfileEdit(true));
  };

  return (
    <div className={nightMode? `${settingsAnimation}Night` : settingsAnimation}>
      <div className={nightMode? "optionsInSettingsNight" : "optionsInSettings"} onClick={QuitSettings}>
        <MdKeyboardBackspace />
        <p>Back To Menu</p>
      </div>
      <div className={nightMode? "optionsInSettingsNight" : "optionsInSettings"} onClick={() => OpenEditProfile()}>
        <LiaUserEditSolid />
        <p>Edit Profile</p>
      </div>
      <div
        className={nightMode? "optionsInSettingsNight" : "optionsInSettings"}
        onClick={() => {
          dispatch(menuActions.onSetChatTheme(true));
          dispatch(uiActions.setBackDrop(false));
          dispatch(menuActions.onToggleSettings(false));
        }}
      >
        <ImImages />
        <p>Change Chat Theme</p>
      </div>
      <div
        className={nightMode? "optionsInSettingsNight" : "optionsInSettings"}
        onClick={() => {
          DeleteCurrentUser();
        }}
      >
        <AiOutlineDelete />
        <p>Delete Account</p>
      </div>
    </div>
  );
}
