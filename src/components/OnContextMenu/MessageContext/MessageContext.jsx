import React from "react";
import DeleteMessage from "./DeleteMessage";
import ForwardMessage from "./ForwardMessage";
import Copy from "../../UI/Copy";
import "../Oncontext.css";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";

export default function MessageContext({ leftVal, topVal, messagesId }) {
  const user = useSelector((state) => state.chat.user);
  const nightMode = useSelector((state) => state.menu.nightMode);
  const currentUser = auth.currentUser;
  return (
    <div
      className={nightMode? 'messageContextNight' : "messageContext"}
      style={{ left: leftVal + "px", top: topVal + "px" }}
    >
      <Copy copiyingText={messagesId?.text} />
      <ForwardMessage message={messagesId} />
      {user?.type === "channel" ? (
        user?.value.admin === currentUser.uid && (
          <DeleteMessage messageId={messagesId} />
        )
      ) : (
        <DeleteMessage messageId={messagesId} />
      )}
    </div>
  );
}
