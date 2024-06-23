import React, { useState } from 'react'
import defaultUser from "../../../images/defaultUser.png";

export default function AddingMembers({chat,onSelect}) {
  const [checked, setChecked] = useState(false);
  return (
    <div
    className="addingMember"
    key={chat?.[0]}
    onClick={() => {
        onSelect(chat[1]?.userInfo);
        setChecked(!checked)
    }}
    style={checked ? { backgroundColor: "black", color: "white" } : {}}
  >
    <img
      src={
        chat[1]?.userInfo?.photoURL
          ? chat[1]?.userInfo?.photoURL
          : defaultUser
      }
      alt=""
    />
    <div className="addingMemberName">
      <p>{chat[1]?.userInfo?.displayName}</p>
      <p>Online</p>
    </div>
  </div>
  )
}
