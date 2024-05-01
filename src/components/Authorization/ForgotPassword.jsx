import React, { useRef, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { authActions } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

export default function ForgotPassword() {
  const resetPassword = useRef();
  const [error, setError] = useState(true);
  const [result, setResult] = useState(false);
  const dispatch = useDispatch();

  const handleResetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResult(true)
        setError(false)
      })
      .catch(() => {
        setResult(true)
        setError(true);
      });
  };

  return (
    <div className="forgotPasswordSection">
      <h1>Find your account</h1>
      <p>Please enter your email to change your password</p>
      <input type="email" placeholder="Enter email" ref={resetPassword} />
      <button onClick={() => handleResetPassword(resetPassword.current.value)}>
        Send
      </button>
      {result &&
        (error ? (
          <div className="resettingError">
            <div>
              <h1>Something went wrong</h1>
              <FaExclamationCircle className="exl" />
            </div>
            <h2>Please try again later</h2>
            <div>
              <button
                onClick={() =>
                  dispatch(authActions.showForgotPasswordForm(true))
                }
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResult(false);
                }}
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="resettingSuccess">
            <div>
              <h1>Check your inbox</h1>
              <FaCheckCircle className="exl" />
            </div>
            <button
              onClick={() => dispatch(authActions.showForgotPasswordForm(true))}
            >
              Back
            </button>
          </div>
        ))}
    </div>
  );
}
