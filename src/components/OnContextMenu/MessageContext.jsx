import React from "react";
import DeleteMessage from '../OnContextMenu/DeleteMessage'
import ForwardMessage from "./ForwardMessage";
import Copy from "../UI/Copy";

export default function MessageContext({ leftVal, topVal, messagesId }) {
  return (
    <div
      className="messageContext"
      style={{ left: leftVal + "px", top: topVal + "px" }}
    >   
        <Copy copiyingText={messagesId?.text} />
        <ForwardMessage message={messagesId}/>
        <DeleteMessage messageId={messagesId}/>
    </div>
  );
}
