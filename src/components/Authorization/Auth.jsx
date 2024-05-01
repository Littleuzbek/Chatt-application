import React, { Fragment } from "react";
import "./Auth.css";
import { CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux/authSlice";
import ForgotPassword from "./ForgotPassword";

export default function Auth() {
  const dispatch = useDispatch();
 

  const [toggleRegis, setToggleRegis] = useState(false);
  const showSignInForm = useSelector((state) => state.auth.showSignInForm);
  const showForgotPasswrodForm = useSelector(
    (state) => state.auth.showForgotPasswrodForm
  );

  return (
    <Fragment>
      {showSignInForm && (
        <div
          className="Auth"
          onClick={() => dispatch(authActions.showSignInForm(false))}
        >
          <CiCirclePlus className="authButton" />
          <p>CREATE A PROFILE</p>
        </div>
      )}
      {showSignInForm ||
        (showForgotPasswrodForm ? (
          <div className="register">
            {toggleRegis || (
              <Login onChange={setToggleRegis} onChangeValue={toggleRegis} />
            )}
            {toggleRegis && (
              <SignUp onChange={setToggleRegis} onChangeValue={toggleRegis} />
            )}
          </div>
        ) : (
          <ForgotPassword />
        ))}
    </Fragment>
  );
}
