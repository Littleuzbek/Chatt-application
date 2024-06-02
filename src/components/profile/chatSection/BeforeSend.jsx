import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import "./ChatSection.css";
import BackDrop from "../../UI/Backdrop";
import { FiFile } from "react-icons/fi";

export default function BeforeSend({
  beforeSendValue,
  onSetBeforeSend,
  onSend,
  onClearBeforeSendValue,
}) {
  const sourceType = beforeSendValue.type.split("/");

  useEffect(()=>{
    if(sourceType[0] === 'image'){
      return
    }else if(sourceType[0] === 'video'){
      return
    }else if(sourceType.at(-1) === "pdf"){
      return
    }else{
      onSetBeforeSend(false);
      onClearBeforeSendValue(null);
    }
  },[sourceType,onSetBeforeSend,onClearBeforeSendValue])

  let source = URL.createObjectURL(beforeSendValue);

  const SendHandler = (e) => {
    if (e === "yes") {
      onSend();
      onSetBeforeSend(false);
    } else {
      onSetBeforeSend(false);
      onClearBeforeSendValue(null);
    }
  };

  const BeforeSend = () => {
    return (
      <div className="beforeSend">
        <BackDrop />
        <div className="beforeSendItem">
          {sourceType[0] === "image" ? <img src={source} alt="" /> : ""}
          {sourceType[0] === "video" ? <video src={source}></video> : ""}
          {sourceType.at(-1) === "pdf" ? (
            <div className="pdfFile">
              <p>{beforeSendValue?.name}</p>
              <FiFile className="fileIcon" />
            </div>
          ) : (
            ""
          )}
          <div className="btns">
            <button onClick={() => SendHandler("no")}>Don't send</button>
            <button onClick={() => SendHandler("yes")}>Send</button>
          </div>
        </div>
      </div>
    );
  };

  const portal = document.getElementById("modal");

  return <Fragment>{ReactDOM.createPortal(<BeforeSend />, portal)}</Fragment>;
}
