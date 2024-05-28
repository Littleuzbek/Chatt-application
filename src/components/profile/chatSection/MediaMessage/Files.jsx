import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";

export default function Files({ owner, files }) {

  return (
    <a 
    href={files?.fileURL}
    target="_blank"
    rel='noreferrer'
    className="pdfFile"
    style={owner ? {} : { flexDirection: "row-reverse" }}
    >
      <p>{files?.nameOf}</p>
      <FaRegFilePdf className="fileIcon"/>
</a>
  );
}
