import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import deafultUser from "../../../images/defaultUser.png";
import { RiImageAddLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { auth, db } from "../../../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uiActions } from "../../../redux/uiSlice";

export default function EditProfile() {
  const [oldData, setOldData] = useState();
  const [spinner, setSpinner] = useState(false);
  const name = useRef();
  const surname = useRef();
  const aboutYou = useRef();
  const username = useRef();
  const newPassword = useRef();
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      await getDoc(doc(db, "users", currentUser.uid)).then((res) =>
        setOldData(res.data())
      );
    };

    return () => {
      fetchUserData();
    };
  }, [oldData, currentUser]);

  const CloseProfileEdit = () => {
    dispatch(menuActions.onToggleProfileEdit(false));
  };

  const SubmitChanges = async () => {
    setSpinner(true);
    const newName = name.current.value === "" && surname.current.value === ""? oldData?.displayName : name.current.value;
    const newSurname = surname.current.value === "" ? "" : surname?.current.value;
    const newAboutYou = aboutYou.current.value === "" ? oldData?.about : aboutYou?.current.value;
    const newUsername = username.current.value === "" ? oldData?.username : username?.current.value;
    const password = newPassword?.current?.value;

    if (newPassword.current.value !== "") {
      const credit = EmailAuthProvider.credential(
        currentUser.email,
        prompt("Please enter your password")
      );

      reauthenticateWithCredential(currentUser, credit)
      .then(async()=>{
        await updatePassword(currentUser, password)
        .catch(err=>console.log(err));
        
        await updateProfile(currentUser, {
          displayName: `${newName} ${newSurname}`,
        }).catch((err) => err);
        
          await updateDoc(doc(db, "users", currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: `${newName} ${newSurname}`,
            about: `${newAboutYou}`,
            username: `${newUsername}`,
            photoURL: "",
          }).catch((err) => console.log(err));
        }
      )
      .catch((err) => {
        console.log(err.code)
      });
    } else {
      await updateProfile(currentUser, {
        displayName: `${newName} ${newSurname}`,
      }).catch((err) => console.log(err));

      await updateDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: `${newName} ${newSurname}`,
        about: `${newAboutYou}`,
        username: `${newUsername}`,
        photoURL: "",
      }).catch((err) => err);
    }

    setSpinner(false);
    dispatch(menuActions.onToggleProfileEdit(false));
    dispatch(menuActions.onSettingsAnimation("settings"));
    dispatch(uiActions.setBackDrop(false));
  };

  return (
    <div className="editProfile">
      <div>
        <FaArrowLeft
          className="backtomenu"
          onClick={() => CloseProfileEdit()}
        />
        <img src={deafultUser} alt="" />
        <RiImageAddLine className="editIcon" />
      </div>
      <div>
        <p>Name</p>
        <input type="text" id="" ref={name} />
      </div>
      <div>
        <p>Surname</p>
        <input type="text" id="" ref={surname} />
      </div>
      <div>
        <p>About you</p>
        <input type="text" id="" ref={aboutYou} />
      </div>
      <div>
        <p>Username</p>
        <input type="text" id="" ref={username} />
      </div>
      <div>
        <p>New password</p>
        <input type="text" id="" ref={newPassword} />
      </div>
      {spinner || <button onClick={() => SubmitChanges()}>Save</button>}
      {spinner && <div className="loader"></div>}
    </div>
  );
}
