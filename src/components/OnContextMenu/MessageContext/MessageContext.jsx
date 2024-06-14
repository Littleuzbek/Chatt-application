import React from "react";
import DeleteMessage from './DeleteMessage'
import ForwardMessage from "./ForwardMessage";
import Copy from "../../UI/Copy";
import '../Oncontext.css'

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
