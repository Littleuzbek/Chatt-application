import React, {  useEffect, useRef, useState } from "react";
import {  useSelector } from "react-redux";

export default function TimeLine({ videoRefVal, pausePlayVal,  onSetPausePlay }) {
  const changedProgress = useSelector(state=>state.chat.videoChangedProgress)
  const [progress,setProgress] = useState(0);
  const intervalRef = useRef();

  useEffect(()=>{
    clearInterval(intervalRef.current);
    setProgress(changedProgress)
  },[changedProgress])
  
  const duration = videoRefVal?.target.duration;

  const minSecond = progress ? Math.round(progress) : "00";
  const minMin = progress ? Math.floor(progress / 60) : "0";
  const maxHours = duration ? Math.floor(duration / 3600) : "";
  const maxMin = duration ? Math.floor(duration / 60) : "0";
  const maxSecond = duration ? duration - maxMin * 60 : "00";
  
  intervalRef.current = setInterval(() => {
    if (!pausePlayVal) {
      setProgress(videoRefVal?.target.currentTime)
    }
    if(videoRefVal?.target.ended){
      onSetPausePlay(true)
    }
  }, 1000);
  
  const changeTime = (value) => {
    clearInterval(intervalRef.current);
    videoRefVal.target.currentTime = value;
    setProgress(videoRefVal?.target.currentTime)
  };

  const addZero = (n) => {
    if (n > 60) {
      return n - maxMin * 60 > 9
        ? "" + (n - maxMin * 60)
        : "0" + (n - maxMin * 60);
    } else {
      return n > 9 ? "" + n : "0" + n;
    }
  };

  return (
    <div className="timeLine" onClick={(e)=>e.stopPropagation()}>
        <p>
          {minMin}:{addZero(Math.round(minSecond))}
        </p>
      <input
        type="range"
        value={
          videoRefVal?.target.currentTime ? videoRefVal?.target.currentTime : 0
        }
        min={0}
        max={duration ? duration : 0}
        onChange={(e) => {
          changeTime(e.target.value);
        }}
        // onTouchMove={
        //   (e) => {
        //     changeTime(e.target.value);
        //   }}
      />
        <p>
          {maxHours >= 1 ? maxHours : ""}
          {maxMin}:{addZero(Math.round(maxSecond))}
        </p>
    </div>
  );
}
