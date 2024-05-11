import React from "react";
import "./App.css";
// import { useMutation } from '@tanstack/react-query';
// import {sendData} from './http-events'
import Auth from "./components/Authorization/Auth";
import Profile from "./components/profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/UI/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { authActions } from "./redux/authSlice";
import { auth } from "./firebase";
import {uiActions} from './redux/uiSlice'
import Condition from "./components/UI/Condition";

function App() {
  const userAuthorized = useSelector((state) => state.auth.authorized);
  const loader = useSelector((state) => state.ui.loader);
  const condition = useSelector((state) => state.ui.condition);
  const dispatch = useDispatch();


  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(authActions.userAuthorized(true));
    } else {
      dispatch(authActions.userAuthorized(false));
    }
    if(loader){
      dispatch(uiActions.setLoader(false));
    }
  });

  return (
    <div className="App">
      {loader ? <Loader /> : userAuthorized ? <Profile /> : <Auth />}
      {condition && <Condition />}
    </div>
  );
}

export default App;
