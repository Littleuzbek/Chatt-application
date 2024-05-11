import React, { Fragment } from "react";

export default function Media({src}) {
  return (
    <Fragment>
      {src?.img ? 
        <img src={src?.img} alt="" />
        :
        ''
      }
    </Fragment>
  );
}
