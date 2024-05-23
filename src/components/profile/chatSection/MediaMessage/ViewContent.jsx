import React, { Fragment } from "react";
import "./ViewContent.css";
import Backdrop from "../../../UI/Backdrop";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../../redux/uiSlice";
import ZoomContent from "./ZoomContent";
import PreventWindowZoom from "./PreventWindowZoom";
import { chatActions } from "../../../../redux/ChatSlice";
import Player from "./Player";

export default function ViewContent() {
  const contentType = useSelector((state) => state.chat.contentType);
  const dispatch = useDispatch();

  PreventWindowZoom();

  window.addEventListener("keyup", (e) => {
    if (e.code === "Escape") {
      dispatch(uiActions.setViewContent(false));
      dispatch(chatActions.setViewContentValue(""));
    }
  });

  return (
    <Fragment>
      <Backdrop />
      <div
        className="ViewContent"
        onClick={() => {
          dispatch(uiActions.setViewContent(false));
          dispatch(chatActions.setViewContentValue(""));
        }}
      >
        {contentType === "Image" ? <ZoomContent /> : <Player />}
      </div>
    </Fragment>
  );
}
