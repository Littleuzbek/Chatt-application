import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../../redux/uiSlice";
import { chatActions } from "../../../../redux/ChatSlice";

export default function Media({src }) {
  const dispatch = useDispatch();

  const ViewContentHandler = (e) => {
    dispatch(chatActions.setViewContentValue(e.target.currentSrc));

    if (document.pictureInPictureElement) {
      document?.exitPictureInPicture();
      dispatch(uiActions.setViewContent(false));
    }

    if (src?.img) {
      dispatch(chatActions.setContentType("Image"));
    }
    if (src?.video) {
      dispatch(chatActions.setContentType("Video"));
    }

    setTimeout(() => {
      dispatch(uiActions.setViewContent(true));
    }, 100);
  };

  return (
    <Fragment>
      {src?.img ? (
        <img
          src={src?.img}
          alt=""
          id={src?.id}
          onClick={(e) => ViewContentHandler(e)}
          style={{cursor: 'pointer'}}
        />
      ) : (
        <video
          src={src?.video}
          id={src?.id}
          onClick={(e) => ViewContentHandler(e)}
          muted
          autoPlay
          loop
          style={{cursor: 'pointer'}}
          playsInline
        ></video>
      )}
    </Fragment>
  );
}
