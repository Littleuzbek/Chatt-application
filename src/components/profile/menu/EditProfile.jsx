import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import deafultUser from "../../../images/defaultUser.png";
import { RiImageAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../../../redux/menuSlice";
import { auth, db, storage } from "../../../firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { uiActions } from "../../../redux/uiSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";

export default function EditProfile() {
  const [spinner, setSpinner] = useState(false);
  const [img, setImg] = useState("");
  const [imgFile, setImgFile] = useState("");
  const newProfileImg = useSelector((state) => state.menu.newProfileImg);
  const nightMode = useSelector(state=>state.menu.nightMode);
  const name = useRef();
  const surname = useRef();
  const aboutYou = useRef();
  const username = useRef();
  const password = useRef();
  const currentUser = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(() => {
    if (newProfileImg) {
      setImg(newProfileImg);
    } else if (currentUser?.photoURL) {
      setImg(currentUser?.photoURL);
    } else {
      setImg("");
      setImgFile("");
    }
  }, [currentUser.photoURL, newProfileImg]);

  const CloseHandler = useCallback((condition)=>{
    setSpinner(false);
    dispatch(menuActions.onSetProfileImg(false));
    dispatch(menuActions.onToggleProfileEdit(false));
    dispatch(menuActions.onSettingsAnimation("settings"));
    dispatch(uiActions.setBackDrop(false));

    if(condition === 'yes'){
      dispatch(uiActions.setCondition("Changes saved"));
    };
  },[dispatch])
  
  const UploadImg = useCallback(
    async (imgFile) => {
        const storageRef = ref(storage, uuid());
        await uploadBytesResumable(storageRef, imgFile).then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then(async (res) => {
            await updateDoc(doc(db,'users',currentUser.uid),{
              photoURL: res
            }).then(CloseHandler('yes')).catch(err=>console.log(err));
            await updateProfile(currentUser, {
              photoURL: res,
            })
            .then(() => {
              CloseHandler('yes')
              })
              .catch((err) => console.log(err));
          });
        });
    },
    [currentUser, CloseHandler]
  );

  const UpdateDocument = async () => {
    try {
      const path = doc(db, "users", currentUser.uid);

      const newName = name.current.value.trim();
      const newSurname = surname.current.value.trim();
      const newAboutYou = aboutYou.current.value.trim();
      const newUsername = username.current.value.trim();

      if (newName !== "" || newSurname !== "") {
        await updateProfile(currentUser, {
          displayName: `${newName} ${newSurname}`,
        })
          .then(CloseHandler('yes'))
          .catch((err) => console.log(err));

        await updateDoc(path, {
          displayName: `${newName} ${newSurname}`,
        }).then(CloseHandler('yes'));
      }

      if (newAboutYou !== "") {
        await updateDoc(path, {
          about: newAboutYou,
        }).then(CloseHandler('yes'));
      }

      if (newUsername !== "") {
        await updateDoc(path, {
          username: newUsername,
        }).then(CloseHandler('yes'));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const SubmitChanges = async () => {
    setSpinner(true);

    const newPassword = password.current.value.trim();

    if (newPassword !== "") {
      const credit = EmailAuthProvider.credential(
        currentUser.email,
        prompt("Please enter your password")
      );

      reauthenticateWithCredential(currentUser, credit)
        .then(async () => {
          await updatePassword(currentUser, newPassword)
            .then(async () => {
              if(imgFile !== ''){
                UploadImg(imgFile);
              }
              UpdateDocument();
              CloseHandler('yes')
            })
            .catch((err) => {
              if (err.code === "auth/weak-password") {
                CloseHandler()
                dispatch(uiActions.setCondition("Weak password"));
              }
              console.log(err.code);
            });
        })
        .catch((err) => {
          if (err.code === "auth/invalid-credential") {
              CloseHandler()
              dispatch(uiActions.setCondition("Incorrect password"));
          }
          console.log(err.code);
        });
    } else {
      if(imgFile !== ''){
        UploadImg(imgFile);
      } 
      UpdateDocument();
    }
  };

  return (
    <div className={nightMode? 'editProfileNight' : "editProfile"}>
      <div>
        <FaArrowLeft
          className="backtomenu"
          onClick={() => dispatch(menuActions.onToggleProfileEdit(false))}
        />
        <img
          src={
            img !== "" ? img : `${newProfileImg ? newProfileImg : deafultUser}`
          }
          alt=""
        />
        <input
          value={""}
          type="file"
          name=""
          id="receiveFile"
          accept="image/*"
          onChange={(e) => {
            if(e.target.files[0].type.split('/').at(0) !== 'image'){
              dispatch(uiActions.setCondition("Please enter only image file"));
            }else{
              dispatch(menuActions.onSetProfileImg(e.target.files[0]));
              setImgFile(e.target.files[0]);
            }
          }}
        />
        <label htmlFor="receiveFile" className="labelForIcon">
          <RiImageAddLine className="editIcon" />
        </label>
      </div>
      {newProfileImg && (
        <button onClick={() => dispatch(menuActions.onSetProfileImg(false))}>
          Don't save
        </button>
      )}
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
        <input type="text" id="" pattern=".{8,}" ref={password} />
      </div>
      {spinner || <button onClick={() => SubmitChanges()}>Save</button>}
      {spinner && <div className="loader"></div>}
    </div>
  );
}
