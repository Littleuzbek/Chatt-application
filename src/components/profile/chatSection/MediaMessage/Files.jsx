import React from "react";
import { FaRegFilePdf } from "react-icons/fa6";

export default function Files({ files }) {

  return (
    <a 
    href={files?.fileURL}
    target="_blank"
    rel='noreferrer'
    className="pdfFile"
    >
      <p>{files?.nameOf}</p>
      <FaRegFilePdf className="fileIcon"/>
</a>
  );
}
