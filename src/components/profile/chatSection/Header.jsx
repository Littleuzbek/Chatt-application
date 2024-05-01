import React, { Fragment } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { useSelector } from "react-redux";
import defaultUser from "../../../images/defaultUser.png";

export default function Header() {
  const user = useSelector((state) => state.chat.user);
  const displayName = user && user?.displayName;

  return (
    <Fragment>
      <div className="header">
        <img src={user?.photoURL ? user?.photoURL : defaultUser} alt="" />
        <div>
          <p>{displayName}</p>
          <p>Online</p>
        </div>
        <IoMdSearch className="btn" />
        <CiMenuKebab className="btn" />
      </div>
    </Fragment>
  );
}
