import React, {  useRef, useState } from "react";
import rewind from "../../../../images/rewind.png";
import rewindForward from "../../../../images/rewindforward.png";
import { CiPause1 } from "react-icons/ci";
import { CiPlay1 } from "react-icons/ci";
import { IoMdVolumeHigh } from "react-icons/io";
import { IoMdVolumeLow } from "react-icons/io";
import { IoMdVolumeMute } from "react-icons/io";
import { RxEnterFullScreen } from "react-icons/rx";
import { RxExitFullScreen } from "react-icons/rx";
import { CgMiniPlayer } from "react-icons/cg";
import { SlSpeedometer } from "react-icons/sl";
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch} from "react-redux";
import { chatActions } from "../../../../redux/ChatSlice";
import { uiActions } from "../../../../redux/uiSlice";

export default function Controller({
  pausePlayVal,
  onPausPlay,
  videoRefVal,
  requestFullscreen,
  fullScreenModeVal,
}) {
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(10);
  const [showSpeed, setShowSpeed] = useState(false);
  const [sideFn,setSideFn] = useState(false);
  const dispatch = useDispatch();

  const Rewind = (e) => {
    if (e === "forward") {
      dispatch(
        chatActions.setChangedProgress((videoRefVal.target.currentTime += 10))
      );
    }

    if (e === "backword") {
      if (videoRefVal?.target.currentTime !== 0) {
        videoRefVal.target.currentTime -= 10;
      }
    }
  };

  const VolumeHandler = (e) => {
    const value = Number(e.target.value) / 10;
    videoRefVal.target.volume = value;
    setVolume(Number(e.target.value));
  };

  const Mute = () => {
    videoRefVal.target.volume = 0;
    setMute(true);
    setVolume(0);
  };

  const UnMute = () => {
    videoRefVal.target.volume = 1;
    setMute(false);
    setVolume(10);
  };

  const SpeedHandler = (e) => {
    setShowSpeed(!showSpeed);
    try {
      if (e === "0.5") {
        videoRefVal.target.playbackRate = 0.5;
        setShowSpeed(false);
      }
      if (e === "1") {
        videoRefVal.target.playbackRate = 1;
        setShowSpeed(false);
      }
      if (e === "1.25") {
        videoRefVal.target.playbackRate = 1.25;
        setShowSpeed(false);
      }
      if (e === "1.5") {
        videoRefVal.target.playbackRate = 1.5;
        setShowSpeed(false);
      }
      if (e === "2") {
        videoRefVal.target.playbackRate = 2;
        setShowSpeed(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PictureInPicture = async () => {
    try {
      const playeR = document.querySelector(".viD");
      playeR.requestPictureInPicture();
      const layer = document.querySelector(".ViewContent");
      const back = document.querySelector(".backDrop");
      back.style.display = "none";
      layer.style.display = "none";
    } catch (err) {
      console.log(err);
    }
  };

  document.addEventListener("leavepictureinpicture", () => {
    dispatch(uiActions.setViewContent(false));
  });
  return (
    <div className="controllers" onClick={(e) => e.stopPropagation()}>
      <div className="volume">
        {mute ? (
          <IoMdVolumeMute className="sideBtn" onClick={() => UnMute()} />
        ) : volume < 4 ? (
          <IoMdVolumeLow className="sideBtn" onClick={() => Mute()} />
        ) : (
          <IoMdVolumeHigh className="sideBtn" onClick={() => Mute()} />
        )}
        <input
          type="range"
          value={volume}
          min={0}
          max={10}
          onChange={(e) => VolumeHandler(e)}
          onClick={(e) => VolumeHandler(e)}
        />
      </div>
      <img
        src={rewind}
        className="ctrlBtn rwnd"
        onClick={() => Rewind("backword")}
        alt=""
      />
      {sideFn || <div className="ctrlBtn rwndMini" onClick={() => Rewind("backword")}>-10</div>}
      {pausePlayVal ? (
        <CiPlay1 onClick={() => onPausPlay()} className={`ctrlBtn ${sideFn && 'ctrlBtnOff'}`} />
      ) : (
        <CiPause1 onClick={() => onPausPlay()} className={`ctrlBtn ${sideFn && 'ctrlBtnOff'}`} />
      )}
      <img
        src={rewindForward}
        className="ctrlBtn rwnd"
        onClick={() => Rewind("forward")}
        alt=""
      />
      {sideFn || <div className="ctrlBtn rwndMini" onClick={() => Rewind("forward")}>+10</div>}
      {/* side function for pc */}
      <div className="sideFn">
        {fullScreenModeVal ? (
          <RxExitFullScreen
            className="sideBtn"
            onClick={() => requestFullscreen()}
          />
        ) : (
          <RxEnterFullScreen
            className="sideBtn"
            onClick={() => requestFullscreen()}
          />
        )}
        <CgMiniPlayer className="sideBtn" onClick={() => PictureInPicture()} />
        <SlSpeedometer
          className="sideBtn"
          onClick={() => SpeedHandler()}
        />
      </div>
      {/* side function for mobile */}
      {sideFn && <div className={`sideFnMenu ${fullScreenModeVal && 'fullScreenSideMenu'}`}>
      {fullScreenModeVal ? (
          <RxExitFullScreen
            className="sideBtn"
            onClick={() => requestFullscreen()}
          />
        ) : (
          <RxEnterFullScreen
            className="sideBtn"
            onClick={() => requestFullscreen()}
          />
        )}
        <CgMiniPlayer className="sideBtn" onClick={() => PictureInPicture()} />
        <SlSpeedometer
          className="sideBtn"
          onClick={() => SpeedHandler()}

        />
      </div>}
      <CiMenuKebab className="sideFnMenuBtn" onClick={()=>setSideFn(!sideFn)}/>
      {showSpeed && (
        <div
          className={`speedBtn ${fullScreenModeVal && 'fullScreenSpeedBtn'}`}
        >
          <p onClick={() => SpeedHandler("0.5")}>0.5x</p>
          <p onClick={() => SpeedHandler("1")}>Normal</p>
          <p onClick={() => SpeedHandler("1.25")}>1.25x</p>
          <p onClick={() => SpeedHandler("1.5")}>1.5x</p>
          <p onClick={() => SpeedHandler("2")}>2x</p>
        </div>
      )}
    </div>
  );
}
