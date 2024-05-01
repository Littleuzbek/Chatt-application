import React, { Fragment } from "react";
import "./Error.css";

const UserDeletionError = () => {
  function my(e) {
    e.preventDefault();
  }
  return (
    <form className="deleteUserError">
      <h2>Somethin went wrong!</h2>
      <button onClick={my}>Try again</button>
    </form>
  );
};

export default function Error({incoming}) {
  
  let errors = <UserDeletionError />;
  return (
    <Fragment>
        { errors }
    </Fragment>
    );
}
