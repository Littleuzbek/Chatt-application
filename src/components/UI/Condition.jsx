import React, { useCallback, useEffect, useState } from "react";
import "./Condition.css";
import { useDispatch, useSelector } from "react-redux";
import failed from "../../images/failed.png";
import success from "../../images/check.png";
import { uiActions } from "../../redux/uiSlice";

export default function Condition() {
  const condition = useSelector((state) => state.ui.condition);
  const [mark, setMark] = useState(false);
  const dispatch = useDispatch()

  const timeOut = useCallback(()=>{
    setTimeout(() => {
      dispatch(uiActions.setCondition(false))
    }, 2500);
  },[dispatch])

  useEffect(() => {
    if (condition === "SignUp success") {
      setMark(true);
      timeOut();
    }else if(condition === "Login success"){
      setMark(true);
      timeOut();
    }else if(condition === "Account deleted"){
      setMark(true);
      timeOut();
    }else if(condition === "Changes saved"){
      setMark(true);
      timeOut();
    }else if(condition === "Incorrect password"){
      setMark(false);
      timeOut();
    }else if(condition === "Weak password"){
      setMark(false);
      timeOut();
    }
  }, [condition,timeOut]);

  return (
    <div className="conditionIndicator">
      {condition}
      {
        mark ? 
        <img src={success} alt="" />
        :
        <img src={failed} alt="" />
      }
    </div>
  );
}
