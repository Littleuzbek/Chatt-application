import React from "react";
import defaultUser from "../../../images/defaultUser.png";

export default function User({ chatVal, onSelect, onGetPosition }) {
  return (
    <div
      className="user"
      onClick={() => onSelect(chatVal[1])}
      onContextMenu={(e) => {
        onGetPosition(e, chatVal);
      }}
    >
      <img
        src={
          chatVal[1]?.userInfo?.photoURL || chatVal[1]?.groupInfo?.photoURL || chatVal[1]?.channelInfo?.photoURL
            ? chatVal[1]?.userInfo?.photoURL || chatVal[1]?.groupInfo?.photoURL || chatVal[1]?.channelInfo?.photoURL
            : defaultUser
        }
        alt=""
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
