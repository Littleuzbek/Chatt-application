import React, { Fragment, useCallback, useEffect, useState } from "react";
import Controller from "./Controller";
import TimeLine from "./TimeLine";
import Backdrop from "../../../UI/Backdrop";
import { FaChevronDown } from "react-icons/fa";
import "./Player.css";
import { useSelector } from "react-redux";

export default function Player() {
  const [videoRef, setVideoRef] = useState();
  const [pausePlay, setPausePlay] = useState(true);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [controlBtn, setControlBtn] = useState({ up: false, down: false });
  const [control, setControl] = useState(false);
  const viewContnetValue = useSelector((state) => state.chat.viewContentValue);

  useEffect(()=>{
    videoRef?.target.play();
    setPausePlay(false)
  },[videoRef])
  
  const PlayPause = useCallback(() => {
    try {
      if (videoRef?.target.paused) {
        videoRef?.target.play();
        setPausePlay(false);
      } else {
        setPausePlay(true);
        videoRef?.target.pause();
      }
    } catch (err) {
      console.log(err);
    }
  },[videoRef?.target]);

  const GetRef = (e) => {
    setVideoRef(e);
  };

  const FullScreenHandler = () => {
    try {
      const playeR = document.querySelector(".playeR");

      if (document.fullscreenElement) {
        setFullScreenMode(false);
        document.exitFullscreen();
        setControlBtn({ up: false, down: false });
        setControl(false);
      } else if (videoRef?.target.requestFullscreen) {
        setFullScreenMode(true);
        playeR.requestFullscreen();
        setControlBtn({ up: false, down: true });
      } else if (videoRef?.target.webkitRequestFullscreen) {
        /* Safari */
        setFullScreenMode(true);
        playeR.webkitRequestFullscreen();
        setControlBtn({ up: false, down: true });
      } else if (videoRef?.target.msRequestFullscreen) {
        /* IE11 */
        setFullScreenMode(true);
        playeR.msRequestFullscreen();
        setControlBtn({ up: false, down: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Backdrop />
      <div className="Layer">
        <div
          className="playeR"
          style={fullScreenMode ? { width: "100%", height: "100%" } : {}}
        >
          <video
            // autoPlay={true}
            src={viewContnetValue}
            onLoadedData={(e) => GetRef(e)}
            onClick={(e) => {
              e.stopPropagation()
              PlayPause()}
            }
            onDoubleClick={() => FullScreenHandler()}
            style={
              fullScreenMode ? { maxHeight: "100%",maxWidth: '100%', height: '100%', borderRadius: "0px" } : {}
            }
            className="viD"
          ></video>
          {controlBtn.down && (
            <FaChevronDown
              className="hidePlayerCtrl"
              onClick={(e) => {
                e.stopPropagation()
                setControlBtn({
                  down: false,
                  up: true,
                });
                setControl(true);
              }}
            />
          )}
          {controlBtn.up && (
            <FaChevronDown
              className="showPlayerCtrl"
              onClick={(e) => {
                e.stopPropagation()
                setControlBtn({
                  up: false,
                  down: true,
                });
                setControl(false);
              }}
            />
          )}
          {control || (
            <div
              className="controlRoom"
              style={
                fullScreenMode
                  ? {
                      position: "absolute",
                      bottom: "5px",
                      width: "30%",
                      height: "8%",
                    }
                  : {}
              }
            >
              <TimeLine
                videoRefVal={videoRef}
                pausePlayVal={pausePlay}
                onSetPausePlay={setPausePlay}
              />
              <Controller
                onPausPlay={PlayPause}
                pausePlayVal={pausePlay}
                videoRefVal={videoRef}
                requestFullscreen={FullScreenHandler}
                fullScreenModeVal={fullScreenMode}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
