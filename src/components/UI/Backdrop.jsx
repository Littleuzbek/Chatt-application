import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./Backdrop.css";
import { useDispatch } from "react-redux";
import { menuActions } from "../../redux/menuSlice";
import { uiActions } from "../../redux/uiSlice";

export default function Backdrop() {
  const dispatch = useDispatch();

  const portal = document.getElementById("backdrop");

  const handleClose = () => {
    dispatch(menuActions.onToggleSettings(false));
    dispatch(menuActions.onToggleProfileEdit(false))
    dispatch(menuActions.onSettingsAnimation('settings'));
    dispatch(uiActions.setBackDrop(false));
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div className="backDrop" onClick={() => handleClose()}></div>,
        portal
      )}
    </Fragment>
  );
}
