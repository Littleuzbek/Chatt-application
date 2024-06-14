import React, { Fragment } from "react";
import { useSelector } from "react-redux";

export default function AboutUser({chosenUserVal }) {
  const user = useSelector((state) => state.chat.user);

  return (
    <Fragment>
      <div>
        <p>Name</p>
        <p>{chosenUserVal?.displayName || user?.value.displayName}</p>
      </div>
        <div>
          <p>Username</p>
          <p>{chosenUserVal?.username || '...'}</p>
        </div>
        <div>
          <p>About</p>
          <p>{chosenUserVal?.about || '...'}</p>
        </div>
    </Fragment>
  );
}
