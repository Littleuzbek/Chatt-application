import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./ChatSection.css";
import BackDrop from '../../UI/Backdrop'

export default function BeforeSend({
  beforeSendImg,
  onSetBeforeSend,
  onSendImg,
  onClearBeforeSend
}) {

  const SendHandler = (e) => {
    if(e === 'yes'){
      onSendImg();
      onSetBeforeSend(false);
    }else{
      onSetBeforeSend(false);
      onClearBeforeSend(null);
    }
  };

  let image = URL.createObjectURL(beforeSendImg);

  const BeforeSend = () => {
    return (
      <div className="beforeSend">
        <BackDrop />
        <div className="beforeSendItem">
          <img src={image} alt="" />
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
