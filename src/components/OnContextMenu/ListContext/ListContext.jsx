import React from "react";
import ClearHistory from "./ClearHistory";
import DeleteUserFromList from "./DeleteUserFromList";
import "../Oncontext.css";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../redux/uiSlice";

export default function ListContext({
  leftVal,
  topVal,
  selectedUser,
  onSetTimeOff,
}) {
  const dispatch = useDispatch();
  return (
    <div
      className="listContext"
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
