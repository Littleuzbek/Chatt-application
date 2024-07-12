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
}) {
  const nightMode = useSelector((state) => state.menu.nightMode);
  const dispatch = useDispatch();
  return (
    <div
      className={nightMode? 'listContextNight' : "listContext"}
      style={{ left: leftVal + "px", top: topVal + "px" }}
      onClick={()=>{
        dispatch(
          uiActions.setClickValue({
            type: "list",
            value: false,
          })
        )}}
    >
      <ClearHistory selectedUser={selectedUser} />
      <DeleteUserFromList selectedUser={selectedUser}/>
    </div>
  );
}
