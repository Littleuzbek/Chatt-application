import React, { Fragment } from "react";
import Files from "../../profile/chatSection/MediaMessage/Files";
import { FaAngleDown } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function AboutMedia({
  onSetCatogry,
  onSetSection,
  categoryVal,
  onViewContentHandler,
}) {
  const messages = useSelector((state) => state.chat.messages);
  return (
    <Fragment>
      <FaAngleDown className="toInfo" onClick={() => onSetSection(false)} />
      <div className="sectioN">
        <div
          onClick={() => onSetCatogry("img")}
          style={
            categoryVal === "img"
              ? { backgroundColor: "black", color: "white" }
              : {}
          }
        >
          Photos
        </div>
        <div
          onClick={() => onSetCatogry("video")}
          style={
            categoryVal === "video"
              ? { backgroundColor: "black", color: "white" }
              : {}
          }
        >
          Videos
        </div>
        <div
          onClick={() => onSetCatogry("files")}
          style={
            categoryVal === "files"
              ? { backgroundColor: "black", color: "white" }
              : {}
          }
        >
          Files
        </div>
      </div>
      <div className="itemS">
        {categoryVal === "img"
          ? messages?.map(
              (m) =>
                m?.img && (
                  <img
                    key={m?.id}
                    src={m?.img}
                    alt=""
                    onClick={(e) => onViewContentHandler(e, "img")}
                  />
                )
            )
          : ""}
        {categoryVal === "video"
          ? messages?.map(
              (m) =>
                m?.video && (
                  <video
                    key={m?.id}
                    src={m?.video}
                    onClick={(e) => onViewContentHandler(e, "video")}
                  ></video>
                )
            )
          : ""}
        {categoryVal === "files"
          ? messages?.map(
              (m) => m?.files && <Files files={m?.files} key={m?.id} />
            )
          : ""}
      </div>
    </Fragment>
  );
}
