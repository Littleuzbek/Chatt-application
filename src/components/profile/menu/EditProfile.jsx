import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import deafultUser from "../../../images/defaultUser.png";
import { RiImageAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { auth, db } from "../../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uiActions } from "../../../redux/uiSlice";

export default function EditProfile() {
  const [oldData, setOldData] = useState();
  const [spinner, setSpinner] = useState(false);
  const [img,setImg] = useState()
  const newProfileImg = useSelector(state=>state.menu.newProfileImg);
  const name = useRef();
  const surname = useRef();
  const aboutYou = useRef();
  const username = useRef();
  const newPassword = useRef();
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(()=>{
    if(currentUser?.photoURL){
      setImg(currentUser?.photoURL);
    }else if(newProfileImg){
      setImg(newProfileImg);
    }
  },[currentUser, newProfileImg])

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
  console.log(oldData?.about)
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
        .then(async () => {
          await updatePassword(currentUser, password)
            .then(async () => {
              await updateProfile(currentUser, {
                displayName: newName + newSurname,
                photoURL: `${img? img : ''}`
              }).catch((err) => console.log(err));

              await updateDoc(doc(db, "users", currentUser.uid), {
                displayName: newName + newSurname,
                uid: currentUser.uid,
                email: currentUser.email,
                about: `${newAboutYou === undefined ? `Hi! Let's be friends` : newAboutYou}`,
                username: `${newUsername === undefined ? '' : newUsername}`,
                photoURL: `${img? img : ''}`,
              }).catch((err) => console.log(err));

              setSpinner(false);
              dispatch(uiActions.setCondition("Changes saved"));
            })
            .catch((err) => {
              if (err.code === "auth/weak-password") {
                dispatch(uiActions.setCondition("Weak password"));
              }
              console.log(err.code);
            });
        })
        .catch((err) => {
          if (err.code === "auth/invalid-credential") {
            dispatch(uiActions.setCondition("Incorrect password"));
          }
          console.log(err.code);
        });
    } else {

      await updateProfile(currentUser, {
        displayName: newName + newSurname,
        photoURL: `${img? img : ''}`
      }).catch((err) => console.log(err));

      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName: newName + newSurname,
        uid: currentUser.uid,
        email: currentUser.email,
        about: `${newAboutYou}`,
        username: `${newUsername}`,
        photoURL: `${img? img : ''}`,
      })
        .then(() => {
          dispatch(uiActions.setCondition("Changes saved"));
          setSpinner(false);
        })
        .catch((err) => console.log(err));
    }

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
        <img src={img? img : deafultUser} alt="" />
        <input type="file" 
        name="" 
        id="receiveFile" 
        accept="image/*"
        onChange={(e) => {
          dispatch(menuActions.onSetProfileImg(e.target.files[0]));
        }}
         />
        <label htmlFor="receiveFile" className="labelForIcon">
          <RiImageAddLine className="editIcon"  />
        </label>
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
        <input type="text" id="" ref={newPassword} pattern=".{8,}" />
      </div>
      {spinner || <button onClick={() => SubmitChanges()}>Save</button>}
      {spinner && <div className="loader"></div>}
    </div>
  );
}
