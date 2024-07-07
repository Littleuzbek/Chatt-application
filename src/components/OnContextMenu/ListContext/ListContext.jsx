import React from "react";
import ClearHistory from "./ClearHistory";
import DeleteUserFromList from "./DeleteUserFromList";
import "../Oncontext.css";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";

export default function ListContext({
  leftVal,
  topVal,
  selectedUser,
  onSetTimeOff,
}) {
  const nightMode = useSelector((state) => state.menu.nightMode);
  const dispatch = useDispatch();
  return (
    <div
      className={nightMode? 'listContextNight' : "listContext"}
      style={{ left: leftVal + "px", top: topVal + "px" }}
      onClick={()=>{onSetTimeOff(false);
        dispatch(
          uiActions.setClickValue({
            type: "list",
            value: false,
          })
        );}}
      onMouseEnter={() => onSetTimeOff(true)}
      onMouseLeave={() => {
        onSetTimeOff(false);
        dispatch(
          uiActions.setClickValue({
            type: "list",
            value: false,
          })
        );
      }}
    >
      <ClearHistory selectedUser={selectedUser} />
      <DeleteUserFromList selectedUser={selectedUser}/>
    </div>
  );
}
