import React, { useState } from "react";
import defaultUser from "../../../images/defaultUser.png";
import defaultUsers from "../../../images/defaultUsers.jpg";

export default function User({ chatVal, onSelect, onGetPosition }) {
  const [imgError,setImgError] = useState(false)
  const chatImg = chatVal[1]?.userInfo?.photoURL ? defaultUser : defaultUsers
  return (
    <div
      className="user"
      onClick={() => onSelect(chatVal[1])}
      onContextMenu={(e) => {
        onGetPosition(e, chatVal);
      }}
    >
      <img
        src={ imgError? chatImg :
          chatVal[1]?.userInfo?.photoURL || chatVal[1]?.groupInfo?.photoURL || chatVal[1]?.channelInfo?.photoURL
            ? chatVal[1]?.userInfo?.photoURL || chatVal[1]?.groupInfo?.photoURL || chatVal[1]?.channelInfo?.photoURL
            : chatImg
        }
        alt=""
        onError={()=>setImgError(true)}
      />
      <div className="textSection">
        <p className="nameOfChat">
          {chatVal[1]?.userInfo?.displayName ||
            chatVal[1]?.groupInfo?.displayName || chatVal[1]?.channelInfo?.displayName}
        </p>
        <p className="lastMessage">{chatVal[1]?.lastMessage?.text}</p>
      </div>
    </div>
  );
}
