import React, {
  Fragment,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Backdrop from "../../../UI/Backdrop";
import { FaChevronDown } from "react-icons/fa";
import "./Player.css";
import { useSelector } from "react-redux";
const Controller = lazy(() => import("./Controller"));

export default function Player() {
  const [videoRef, setVideoRef] = useState();
  const [pausePlay, setPausePlay] = useState(true);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [controlBtn, setControlBtn] = useState({ up: false, down: false });
  const [control, setControl] = useState(false);
  const changedProgress = useSelector(
    (state) => state.chat.videoChangedProgress
  );
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();
  const viewContnetValue = useSelector((state) => state.chat.viewContentValue);

  useEffect(() => {
    videoRef?.target.play();
    setPausePlay(false);
  }, [videoRef]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    setProgress(changedProgress);
  }, [changedProgress]);

  const duration = videoRef?.target.duration;

  const minSecond = progress ? Math.round(progress) : "00";
  const minMin = progress ? Math.floor(progress / 60) : "0";
  const maxHours = duration ? Math.floor(duration / 3600) : "";
  const maxMin = duration ? Math.floor(duration / 60) : "0";
  const maxSecond = duration ? duration - maxMin * 60 : "00";

  intervalRef.current = setInterval(() => {
    if (!pausePlay) {
      setProgress(videoRef?.target.currentTime);
    }
    if (videoRef?.target.ended) {
      setPausePlay(true);
    }
  }, 1000);

  const changeTime = (value) => {
    clearInterval(intervalRef.current);
    videoRef.target.currentTime = value;
    setProgress(videoRef?.target.currentTime);
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
  }, [videoRef?.target]);

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
              e.stopPropagation();
              PlayPause();
            }}
            onDoubleClick={() => FullScreenHandler()}
            style={
              fullScreenMode
                ? {
                    maxHeight: "100%",
                    maxWidth: "100%",
                    height: "100%",
                    borderRadius: "0px",
                  }
                : {}
            }
            className="viD"
          ></video>
          {controlBtn.down && (
            <FaChevronDown
              className="hidePlayerCtrl"
              onClick={(e) => {
                e.stopPropagation();
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
                e.stopPropagation();
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
              <div className="timeLine" onClick={(e) => e.stopPropagation()}>
                <p>
                  {minMin}:{addZero(Math.round(minSecond))}
                </p>
                <input
                  type="range"
                  value={
                    videoRef?.target.currentTime
                      ? videoRef?.target.currentTime
                      : 0
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
              <Suspense>
                <Controller
                  onPausPlay={PlayPause}
                  pausePlayVal={pausePlay}
                  videoRefVal={videoRef}
                  requestFullscreen={FullScreenHandler}
                  fullScreenModeVal={fullScreenMode}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
