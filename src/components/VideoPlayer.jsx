import React, { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "../app/PlayerContext";
import {
  Gauge,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  ToggleLeft,
  ToggleRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import clsx from "clsx";
import useWindowResize from "../hooks/useWindowResize";
import {
  getAutoPlayStatus,
  getCurrentVideoStatus,
  saveVideoStatus,
  setAutoPlayStatus,
} from "../lib/localStorageHelper";

const speedOptions = {
  0.5: "0.5",
  0.75: "0.75",
  1: "Normal",
  1.25: "1.25",
  1.5: "1.5",
  1.75: "1.75",
  2: "2",
};

const VideoPlayer = () => {
  const { activeVideo, nextVideo, previousVideo, updateVideoRef } =
    usePlayerContext();
  const { isMobileView } = useWindowResize();

  const [hoverFocus, setHoverFocus] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMode, setPlayerMode] = useState("DEFAULT");
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(true);
  const [message, setMessage] = useState();

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const timerRef = useRef(null);
  const seekBarRef = useRef(null);
  const seekBarContainerRef = useRef(null);
  const playButtonRef = useRef(null);

  let timeout;

  let messageTimeout;

  const roundOffTime = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const formatTime = (time) => {
    if (!time) return "0:00";
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    return `${minutes}:${roundOffTime.format(seconds)}`;
  };

  useEffect(() => {
    const videoPlayer = videoRef.current;
    updateVideoRef(videoRef);
    if (!videoPlayer) return;

    const videoLocalData = getCurrentVideoStatus(activeVideo.id);
    // Current video previous state
    if (videoLocalData) {
      videoPlayer.currentTime = videoLocalData.completedDuration;
      const percentCompleted =
        (videoPlayer.currentTime * 100) / videoPlayer.duration;
      seekBarRef.current.style.width = `${percentCompleted}%`;
    }
    // Autoplay state
    const autoplay = getAutoPlayStatus();
    setIsAutoPlayEnabled(autoplay);

    const handleFullScreenChange = (e) => {
      if (!document.fullscreenElement) {
        setPlayerMode("DEFAULT");
      } else {
        setPlayerMode("FULLSCREEN");
      }
    };

    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT") return; // Blocking the event from searchbar
      // Spacebar click
      if (e.keyCode === 32) {
        e.preventDefault();
        videoPlayPause();
      }

      // Video Seeking
      if (e.key === "ArrowRight") {
        videoPlayer.currentTime += 10;
        updateMessage("10 >>");
      }

      if (e.key === "ArrowLeft") {
        videoPlayer.currentTime -= 10;
        updateMessage("<< 10");
      }

      // Fullscreen
      if (e.key === "f") {
        if (!document.fullscreenElement) {
          playerContainerRef.current.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }

      // Audio Controls
      if (e.key === "ArrowUp" && videoPlayer.volume < 1) {
        e.preventDefault();
        if (isMuted) setIsMuted(false);
        if (videoPlayer.volume > 0.95) {
          videoPlayer.volume = 1;
          updateMessage(`${parseInt(videoPlayer.volume * 100).toFixed(0)}%`);
          return;
        }
        videoPlayer.volume += 0.05;
        updateMessage(`${parseInt(videoPlayer.volume * 100).toFixed(0)}%`);
        if (videoPlayer.volume === 0) setIsMuted(true);
        else setIsMuted(false);
      }
      if (e.key === "ArrowDown" && videoPlayer.volume > 0) {
        e.preventDefault();
        if (videoPlayer.volume < 0.05) {
          videoPlayer.volume = 0;
          updateMessage(`${parseInt(videoPlayer.volume * 100).toFixed(0)}%`);
          setIsMuted(true);
          return;
        }
        videoPlayer.volume -= 0.05;
        updateMessage(`${parseInt(videoPlayer.volume * 100).toFixed(0)}%`);
      }
      if (e.key === "m") {
        if (videoPlayer.muted) {
          videoPlayer.muted = false;
          updateMessage("Unmute");
        } else {
          videoPlayer.muted = true;
          updateMessage("Mute");
        }

        setIsMuted((prev) => !prev);
      }

      // Playback speed
      if (e.key === ">") {
        if (videoPlayer.playbackRate >= 2) return;
        videoPlayer.playbackRate += 0.25;
        updateMessage(`x${videoPlayer.playbackRate}`);
        setPlaybackSpeed(videoPlayer.playbackRate);
      }
      if (e.key === "<") {
        if (videoPlayer.playbackRate <= 0.25) return;
        videoPlayer.playbackRate -= 0.25;
        updateMessage(`x${videoPlayer.playbackRate}`);
        setPlaybackSpeed(videoPlayer.playbackRate);
      }
      // Video Skipping
      if (e.key === "N") {
        nextVideo();
      }
      if (e.key === "P") {
        nextVideo();
      }
    };

    const videoTimeUpdateHelper = () => {
      timerRef.current.innerHTML = formatTime(videoPlayer.currentTime);
      const percentCompleted =
        (videoPlayer.currentTime * 100) / videoPlayer.duration;
      seekBarRef.current.style.width = `${percentCompleted}%`;

      if (percentCompleted === 100) setIsVideoCompleted(true);
    };

    const videoPlaying = () => {
      setIsPlaying(true);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyPress);
    videoPlayer.addEventListener("timeupdate", videoTimeUpdateHelper);
    videoPlayer.addEventListener("playing", videoPlaying);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyPress);
      videoPlayer.removeEventListener("timeupdate", videoTimeUpdateHelper);
      clearTimeout(timeout);
      clearTimeout(messageTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For change in video
  useEffect(() => {
    const videoPlayer = videoRef.current;
    const videoLocalData = getCurrentVideoStatus(activeVideo.id);
    if (videoLocalData) {
      videoPlayer.currentTime = videoLocalData.completedDuration;
      const percentCompleted =
        (videoPlayer.currentTime * 100) / videoPlayer.duration;
      seekBarRef.current.style.width = `${percentCompleted}%`;
    }
    if (isVideoCompleted) {
      setIsVideoCompleted(false);
    }
    setIsPlaying(false);
    seekBarRef.current.style.width = "0px";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVideo]);

  const videoPlayPause = (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!videoRef.current.paused) {
      videoRef.current.pause();
      saveVideoStatus(videoRef.current.currentTime, activeVideo);
      setIsPlaying(false);
      return;
    }
    videoRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => console.log("Something went wrong", err));
  };

  // Player mode
  const switchMode = (e, mode) => {
    e.stopPropagation();
    setPlayerMode(mode);
    if (mode === "FULLSCREEN") {
      playerContainerRef.current.requestFullscreen();
    }
    if (mode === "DEFAULT" && document.fullscreenElement) {
      document.exitFullscreen();
      setPlayerMode("DEFAULT");
    }
  };

  const manageSpeedControls = (e) => {
    e.stopPropagation();
    setShowSpeedOptions(!showSpeedOptions);
  };

  // Control Video Speed
  const setSpeed = (e, speed) => {
    e.stopPropagation();
    videoRef.current.playbackRate = parseFloat(speed);
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  };

  const playerClickHelper = () => {
    setShowSpeedOptions(false);
    videoPlayPause();
  };

  const mouseLeaveHelper = () => {
    if (playerMode === "FULLSCREEN") return;
    setHoverFocus(false);
    setShowSpeedOptions(false);
  };

  const muteUnmuteVideo = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Video Traversing helper's
  const nextVideoHelper = (e) => {
    e.stopPropagation();
    saveVideoStatus(videoRef.current.currentTime, activeVideo);
    nextVideo();
  };
  const previousVideoHelper = (e) => {
    e.stopPropagation();
    saveVideoStatus(videoRef.current.currentTime, activeVideo);
    previousVideo();
  };

  const replayVideo = () => {
    videoRef.current.currentTime = 0;
    setIsVideoCompleted(false);
  };

  // Seekbar Helpers
  const seekBarHelper = (e) => {
    e.stopPropagation();
    if (!isSeeking) return;
    videoRef.current.pause();
    setIsPlaying(false);

    const distanceToFill =
      e.clientX - seekBarContainerRef.current.getBoundingClientRect().x;
    seekBarRef.current.style.width = `${distanceToFill}px`;
  };

  const seekComplete = (e) => {
    e.stopPropagation();
    const distanceToFill =
      e.clientX - seekBarContainerRef.current.getBoundingClientRect().x;
    seekBarRef.current.style.width = `${distanceToFill}px`;

    const seekBarContainerWidth = seekBarContainerRef.current.offsetWidth;
    const percentCovered = (distanceToFill * 100) / seekBarContainerWidth;
    const percentageToVideoTime =
      (percentCovered / 100) * videoRef.current.duration;
    videoRef.current.currentTime = percentageToVideoTime;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleAutoplay = (e) => {
    e.stopPropagation();
    updateMessage(!isAutoPlayEnabled ? "Autoplay On" : "Autoplay Off");
    setAutoPlayStatus(!isAutoPlayEnabled);
    setIsAutoPlayEnabled(!isAutoPlayEnabled);
  };

  // Mouse handling
  const mouseMoveHandler = () => {
    if (!isPlaying) return setIsMouseMoving(true);

    const videoPlayer = videoRef.current;
    if (!videoPlayer) return;
    const hideMouse = () => {
      setIsMouseMoving(false);
    };

    setIsMouseMoving(true);
    clearTimeout(timeout);
    timeout = setTimeout(hideMouse, 3000);
  };

  const updateMessage = (message) => {
    setMessage(message);
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
      setMessage("");
    }, 700);
  };

  return (
    <div
      className={clsx("relative aspect-video", {
        "cursor-none": !isMouseMoving,
      })}
      onMouseEnter={() => setHoverFocus(true)}
      onMouseLeave={mouseLeaveHelper}
      onClick={playerClickHelper}
      ref={playerContainerRef}
      onMouseMove={mouseMoveHandler}
    >
      <video
        className="w-full h-full rounded-lg"
        controls={false}
        controlsList=""
        src={activeVideo.sources[0]}
        ref={videoRef}
        autoPlay={isAutoPlayEnabled}
      />
      <div
        className={clsx(
          "flex flex-col absolute bottom-0 w-full text-white px-2 transition-all ease-in-out duration-150 z-10 h-1/6 justify-end bg-gradient-to-t from-black/70 to-transparent rounded-b-lg md:pb-3",
          {
            "opacity-100": hoverFocus && isMouseMoving,
            "opacity-0": !hoverFocus || !isMouseMoving,
          }
        )}
      >
        <div
          className="w-full"
          ref={seekBarContainerRef}
          onMouseDown={() => {
            setIsSeeking(true);
          }}
          onMouseUp={(e) => {
            setIsSeeking(false);
          }}
          onMouseMove={seekBarHelper}
        >
          <div
            className="w-full h-[5px] hover:h-[10px] transition-all duration-0 bg-gray-300/70 rounded-full cursor-pointer"
            onClick={seekComplete}
          >
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-0"
              ref={seekBarRef}
            />
          </div>
          <div className="flex justify-between mt-1 px-2 select-none hover:select-auto font-semibold">
            <span ref={timerRef}> 0:00</span>
            <span>{activeVideo.duration}</span>
          </div>
        </div>
        <div className="my-2 px-3 flex justify-center gap-5">
          <div className="text-white flex gap-5 w-max md:flex-1 items-center justify-start relative">
            <div
              className={clsx(
                "flex flex-col bg-black/70 absolute -top-60 -left-2 p-3 rounded-lg text-lg text-center gap-1 w-32 transition-all select-none",
                {
                  "opacity-100": showSpeedOptions,
                  "opacity-0": !showSpeedOptions,
                }
              )}
              onMouseLeave={() => setShowSpeedOptions(false)}
            >
              {Object.entries(speedOptions)
                .sort(([aKey], [bKey]) => parseFloat(aKey) - parseFloat(bKey))
                .map(([key, value]) => (
                  <span
                    className={clsx("hover:font-semibold cursor-pointer", {
                      "font-bold": playbackSpeed.toString() === key,
                    })}
                    onClick={(e) => setSpeed(e, key)}
                    key={key}
                  >
                    {value}
                  </span>
                ))}
            </div>
            <Gauge
              size={isMobileView ? 20 : 30}
              className="cursor-pointer"
              onClick={manageSpeedControls}
            />
            {!isMobileView &&
              (isMuted ? (
                <VolumeX
                  size={isMobileView ? 20 : 30}
                  className="cursor-pointer"
                  onClick={muteUnmuteVideo}
                />
              ) : (
                <Volume2
                  size={isMobileView ? 20 : 30}
                  className="cursor-pointer"
                  onClick={muteUnmuteVideo}
                />
              ))}
            {isAutoPlayEnabled ? (
              <ToggleRight
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={toggleAutoplay}
              />
            ) : (
              <ToggleLeft
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={toggleAutoplay}
              />
            )}
          </div>
          <div className="text-white flex gap-5 w-max md:flex-1 items-center justify-center">
            <SkipBack
              size={isMobileView ? 20 : 30}
              className="cursor-pointer"
              onClick={previousVideoHelper}
            />
            {isVideoCompleted ? (
              <RotateCcw
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={() => replayVideo()}
              />
            ) : isPlaying ? (
              <Pause
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={videoPlayPause}
              />
            ) : (
              <Play
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={videoPlayPause}
                ref={playButtonRef}
              />
            )}

            <SkipForward
              size={isMobileView ? 20 : 30}
              className="cursor-pointer"
              onClick={nextVideoHelper}
            />
          </div>
          <div className="text-white flex gap-5 w-max md:flex-1 items-center justify-end">
            {playerMode === "FULLSCREEN" ? (
              <Minimize
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "DEFAULT")}
              />
            ) : (
              <Maximize
                size={isMobileView ? 20 : 30}
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "FULLSCREEN")}
              />
            )}
          </div>
        </div>
      </div>
      {!isMobileView && (
        <div
          className={clsx(
            "h-max w-max bg-black/60 inset-0 absolute m-auto left-0 right-0 p-2 rounded-lg text-white text-xl transition-all duration-100 ease-in-out",
            {
              "opacity-100": message,
              "opacity-0": !message,
            }
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
