import React, { useRef, useState } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/authSlice";
import { uiActions } from "../../redux/uiSlice";

export default function Login({ onChange, onChangeValue }) {
  const existingEmail = useRef();
  const existingPassword = useRef();
  const [togglePassword, setTogglePassword] = useState(true);
  const [error, setError] = useState();
  const passAttr = togglePassword ? "password" : "text";
  const dispatch = useDispatch()

  const signInUser = (email, password) => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((response) =>{
          dispatch(uiActions.setCondition('Login success'))
           console.log(response)
          })
        .catch(() => setError('Email or password is wrong!'));
    }else{
      setError('Please enter requirements')
    }
  };

  const EnterHandler = (e) =>{
    if(e === 'NumpadEnter' || e === 'Enter'){
      signInUser(
      existingEmail.current.value,
      existingPassword.current.value
      )  
    }      
  }

  return (
    <div className="login" onKeyDown={(e)=>EnterHandler(e.code)}>
      <h1>Login</h1>
      <input 
      required
      type="text" 
      placeholder="Enter email" 
      ref={existingEmail} />
      <div className="password">
        <input
          required
          type={passAttr}
          placeholder="Enter password"
          ref={existingPassword}
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
            signInUser(
              existingEmail.current.value,
              existingPassword.current.value
            )
          }
        >
          Login
        </button>
        <button onClick={() => onChange(!onChangeValue)}>Sign Up</button>
      </div>
      <p
      onClick={()=>{dispatch(authActions.showForgotPasswordForm(false))}}
      >
      Forgot Password?</p>
      <p>{error}</p>
    </div>
  );
}
