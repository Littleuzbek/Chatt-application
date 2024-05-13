import React, { useCallback, useEffect, useState } from "react";
import "./Condition.css";
import { useDispatch, useSelector } from "react-redux";
import failed from "../../images/failed.png";
import success from "../../images/check.png";
import { uiActions } from "../../redux/uiSlice";

export default function Condition() {
  const condition = useSelector((state) => state.ui.condition);
  const [mark, setMark] = useState(false);
  const dispatch = useDispatch();

  const TimeOut = useCallback(() => {
    setTimeout(() => {
      dispatch(uiActions.setCondition(false));
    }, 2500);
  }, [dispatch]);

  useEffect(() => {
    if (condition === "Please enter only image file") {
      setMark(false);
      TimeOut();
    }
    if (condition === "SignUp success") {
      setMark(true);
      TimeOut();
    }
    if (condition === "Login success") {
      setMark(true);
      TimeOut();
    }
    if (condition === "Account deleted") {
      setMark(true);
      TimeOut();
    }
    if (condition === "Changes saved") {
      setMark(true);
      TimeOut();
    }
    if (condition === "Incorrect password") {
      setMark(false);
      TimeOut();
    }
    if (condition === "Weak password") {
      setMark(false);
      TimeOut();
    }
   
  }, [condition, TimeOut]);

  return (
    <div className="conditionIndicator">
      {condition}
      {mark ? <img src={success} alt="" /> : <img src={failed} alt="" />}
    </div>
  );
}
