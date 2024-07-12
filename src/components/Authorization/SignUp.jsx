import React, { useRef, useState } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/authSlice";
import { doc, setDoc } from "firebase/firestore";
import { uiActions } from "../../redux/uiSlice";

export default function SignUp({ onChange, onChangeValue }) {
  const displayName = useRef();
  const newEmail = useRef();
  const newPassword = useRef();
  const [togglePassword, setTogglePassword] = useState(true);
  const [error,setError] = useState()
  const passAttr = togglePassword ? "password" : "text";
  const dispatch = useDispatch()

  const EnterHandler = (e) => {
    if (e === "NumpadEnter" || e === "Enter") {
      createNewUser(newEmail.current.value, newPassword.current.value, displayName.current.value)
    }
  };

  const createNewUser = async (email, password, displayName) => {
    if (email !== "" && password !== "") {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) =>{
        updateProfile(res.user,{
          displayName: `${displayName}`,
        }).catch(err=>console.log(err));
        
        await setDoc(
          doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: '',
            about: `Hi! Let's be friends`,
            username: ``,
          }).catch(err=>console.log(err));
          
          await setDoc(doc(db,'userChats',res.user.uid),{});
          await setDoc(doc(db,'userGroups',res.user.uid),{})
          await setDoc(doc(db,'userChannels',res.user.uid),{})
          await setDoc(doc(db,'usersWallpapers', res.user.uid),{
            inUse: '',
            wallpapers: []});


          dispatch(uiActions.setCondition('SignUp success'))
        }
      )
      .catch(() => setError('Please enter valid email!'));
    }else{
      setError('Please enter requirements')
    }
  };

  return (
    <div className="signUp" onKeyDown={(e) => EnterHandler(e.code)}>
      <h1>Sign Up</h1>
      <input type="text" placeholder="Enter name" ref={displayName} />
      <input type="email" placeholder="Enter email" ref={newEmail} />
      <div className="password">
        <input
          type={passAttr}
          placeholder="Enter password"
          ref={newPassword}
        />
        {togglePassword ? (
          <BsFillEyeSlashFill
            className="hidePassword"
            onClick={() => setTogglePassword(!togglePassword)}
          />
        ) : (
          <BsFillEyeFill
            className="showPassword"
            onClick={() => setTogglePassword(!togglePassword)}
          />
        )}
      </div>
      <div className="btnContainer">
        <button
          onClick={() =>
            createNewUser(newEmail.current.value, newPassword.current.value, displayName.current.value)
          }
        >
          Sign Up
        </button>
        <button onClick={() => onChange(!onChangeValue)}>Login</button>
      </div>
      <p
      onClick={()=>{dispatch(authActions.showForgotPasswordForm(false))}}
      >
        Forgot Password?</p>
      <p>{error}</p>
    </div>
  );
}
