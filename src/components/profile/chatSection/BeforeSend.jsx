import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./ChatSection.css";
import BackDrop from '../../UI/Backdrop'

export default function BeforeSend({
  beforeSendValue,
  onSetBeforeSend,
  onSendImg,
  onClearBeforeSendValue
}) {
  const sourceType = beforeSendValue.type.split('/')

  let source = URL.createObjectURL(beforeSendValue);

  const SendHandler = (e) => {
    if(e === 'yes'){
      onSendImg();
      onSetBeforeSend(false);
    }else{
      onSetBeforeSend(false);
      onClearBeforeSendValue(null);
    }
  };

  const BeforeSend = () => {
    return (
      <div className="beforeSend">
        <BackDrop />
        <div className="beforeSendItem">
          {sourceType[0] === 'image' ? <img src={source} alt="" /> : ''}
          {sourceType[0] === 'video' ? <video src={source} ></video> : ''}
          <div className="btns">
            <button onClick={()=>SendHandler('no')}>Don't send</button>
            <button onClick={()=>SendHandler('yes')}>Send</button>
          </div>
        </div>
      </div>
    );
  };

  const portal = document.getElementById("modal");


  return( 
    <Fragment>
      {ReactDOM.createPortal(<BeforeSend />, portal)}
    </Fragment>
    )
}
