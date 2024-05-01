import React from "react";
import "./ProgressBar.css";
import { HiOutlinePlusSm } from "react-icons/hi";

export default function ProgressBar({ progress }) {
  return (
    <div className="wrap-circles">
      <div className="circle" style={{backgroundImage: `conic-gradient(#fff ${progress}%, #000 0)`}}>
        <div className="inner">
          <HiOutlinePlusSm className="xxx" />
        </div>
      </div>
    </div>
  );
}
