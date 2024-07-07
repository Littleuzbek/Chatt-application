import React, { useState } from 'react'
import defaultUser from "../../../images/defaultUser.png";
import { useSelector } from 'react-redux';

export default function Users({chatVal, onNewMemberHandler}) {
  const [checked,setChecked] = useState(false)
  const nightMode = useSelector(state=>state.menu.nightMode);
  return (
    <div
    className={nightMode? `newGroupUserNight ${checked && 'checkedNight'}` : `newGroupUser ${checked && 'checked'}`}
    key={chatVal?.[0]}
    onClick={() => {
        setChecked(!checked)
        onNewMemberHandler(chatVal, "add")}}
  >
    <img
      src={
        chatVal[1]?.userInfo?.photoURL
          ? chatVal[1]?.userInfo?.photoURL
          : defaultUser
      }
      alt=""
    />
    <div className="newGroupUserName">
      <p>{chatVal[1]?.userInfo?.displayName}</p>
      <p>Online</p>
    </div>
  </div>
  )
}
