import React, { Fragment } from "react";

export default function Media({src,key}) {
  return (
    <Fragment>
      {src?.img ? 
        <img src={src?.img} alt="" id={key} />
        :
        ''
      }
    </Fragment>
  );
}
