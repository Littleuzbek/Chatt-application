import React, { Fragment } from "react";
import "./ViewContent.css";
import Backdrop from "./Backdrop";
import { useDispatch } from "react-redux";
import { uiActions } from "../../redux/uiSlice";
import ZoomContent from "./ZoomContent";
import PreventWindowZoom from "./PreventWindowZoom";

export default function ViewContent() {
  const dispatch = useDispatch();

  PreventWindowZoom();

    window.addEventListener('keyup', (e) => {
    if (e.code === "Escape") {
      dispatch(uiActions.setViewContent(false));
      dispatch(uiActions.setViewContentValue(""));
    }
  });

  return (
    <Fragment>
      <Backdrop />
      <div
        className="ViewContent"
        onClick={() => {
          dispatch(uiActions.setViewContent(false));
          dispatch(uiActions.setViewContentValue(""));
        }}
      >
        <ZoomContent />
      </div>
    </Fragment>
  );
}
