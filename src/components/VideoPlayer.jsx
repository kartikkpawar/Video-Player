import React, { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "../app/PlayerContext";
import {
  Fullscreen,
  Gauge,
  Maximize,
  Minimize,
  Pause,
  Play,
  RectangleHorizontal,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import clsx from "clsx";

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
  const { activeVideo, nextVideo, previousVideo } = usePlayerContext();

  const [hoverFocus, setHoverFocus] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMode, setPlayerMode] = useState("DEFAULT");
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const timerRef = useRef(null);
  const seekBarRef = useRef(null);
  const seekBarContainerRef = useRef(null);

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
    if (!videoPlayer) return;

    const handleFullScreenChange = (e) => {
      if (!document.fullscreenElement) {
        setPlayerMode("DEFAULT");
      }
    };

    const handleKeyPress = (e) => {
      // Spacebar click
      if (e.keyCode === 32) {
        videoPlayPause();
        return;
      }

      // Video Seeking
      if (e.key === "ArrowRight") {
        videoPlayer.currentTime += 10;
        return;
      }

      if (e.key === "ArrowLeft") {
        videoPlayer.currentTime -= 10;
        return;
      }

      // Fullscreen
      if (e.key === "f") {
        playerContainerRef.current.requestFullscreen();
        return;
      }

      // Audio Controls
      if (e.key === "ArrowUp" && videoPlayer.volume < 1) {
        if (isMuted) setIsMuted(false);
        if (videoPlayer.volume > 0.95) {
          videoPlayer.volume = 1;
          return;
        }
        videoPlayer.volume += 0.05;
        if (videoPlayer.volume === 0) setIsMuted(true);
        else setIsMuted(false);
      }
      if (e.key === "ArrowDown" && videoPlayer.volume > 0) {
        if (videoPlayer.volume < 0.05) {
          videoPlayer.volume = 0;
          setIsMuted(true);
          return;
        }
        videoPlayer.volume -= 0.05;
      }
      if (e.key === "m") {
        videoPlayer.volume = 0;
        setIsMuted(true);
        return;
      }
      if (e.key === "u") {
        videoPlayer.volume = 1;
        setIsMuted(false);
      }

      // Playback speed
      if (e.key === ">") {
        if (videoPlayer.playbackRate >= 2) return;
        videoPlayer.playbackRate += 0.25;
        setPlaybackSpeed(videoPlayer.playbackRate);
      }
      if (e.key === "<") {
        if (videoPlayer.playbackRate <= 0.25) return;
        videoPlayer.playbackRate -= 0.25;
        setPlaybackSpeed(videoPlayer.playbackRate);
      }
    };

    const videoTimeUpdateHelper = () => {
      timerRef.current.innerHTML = formatTime(videoPlayer.currentTime);

      const percentCompleted =
        (videoPlayer.currentTime * 100) / videoPlayer.duration;
      seekBarRef.current.style.width = `${percentCompleted}%`;

      if (percentCompleted === 100) setIsVideoCompleted(true);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyPress);
    videoPlayer.addEventListener("timeupdate", videoTimeUpdateHelper);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyPress);
      videoPlayer.removeEventListener("timeupdate", videoTimeUpdateHelper);
    };
  }, []);

  useEffect(() => {
    if (isVideoCompleted) {
      setIsVideoCompleted(false);
      setIsPlaying(false);
    }
    seekBarRef.current.style.width = "0px";
  }, [activeVideo]);

  const videoPlayPause = (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }
    videoRef.current.play();
    setIsPlaying(true);
  };

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

  const nextVideoHelper = (e) => {
    e.stopPropagation();
    nextVideo();
  };
  const previousVideoHelper = (e) => {
    e.stopPropagation();
    previousVideo();
  };

  const replayVideo = () => {
    videoRef.current.currentTime = 0;
    setIsVideoCompleted(false);
  };

  const seekBarClick = (e) => {
    e.stopPropagation();
    const distanceToFill =
      e.clientX - seekBarContainerRef.current.getBoundingClientRect().x;
    seekBarRef.current.style.width = `${distanceToFill}px`;

    const seekBarContainerWidth = seekBarContainerRef.current.offsetWidth;
    const percentCovered = (distanceToFill * 100) / seekBarContainerWidth;

    const percentageToVideoTime =
      (percentCovered / 100) * videoRef.current.duration;
    videoRef.current.currentTime = percentageToVideoTime;
  };

  return (
    <div
      className="relative aspect-video"
      onMouseEnter={() => setHoverFocus(true)}
      onMouseLeave={mouseLeaveHelper}
      onClick={playerClickHelper}
      ref={playerContainerRef}
    >
      <video
        className="w-full h-full rounded-lg"
        controls={false}
        controlsList=""
        src={activeVideo.sources[0]}
        ref={videoRef}
      />
      <div
        className={clsx(
          "flex flex-col absolute bottom-0 w-full text-white px-2 transition-all ease-in-out duration-150 z-10 h-1/6 justify-end bg-gradient-to-t from-black/70 to-transparent rounded-b-lg pb-3",
          {
            "opacity-100": hoverFocus || playerMode === "FULLSCREEN",
            "opacity-0": !hoverFocus,
          }
        )}
      >
        <div className="w-full">
          <div
            className="w-full h-1 hover:h-2 transition-all bg-gray-300/70 rounded-full cursor-pointer"
            onClick={seekBarClick}
            ref={seekBarContainerRef}
          >
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-75"
              ref={seekBarRef}
            />
          </div>
          <div className="flex justify-between mt-1 px-2 select-none hover:select-auto font-semibold">
            <span ref={timerRef}> 0:00</span>
            <span>{activeVideo.duration}</span>
          </div>
        </div>
        <div className="my-2 px-3 flex ">
          <div className="text-white flex gap-5 flex-1 items-center justify-start relative">
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
            <Gauge className="cursor-pointer" onClick={manageSpeedControls} />
            {isMuted ? (
              <VolumeX className="cursor-pointer" onClick={muteUnmuteVideo} />
            ) : (
              <Volume2 className="cursor-pointer" onClick={muteUnmuteVideo} />
            )}
          </div>
          <div className="text-white flex gap-5 flex-1 items-center justify-center">
            <SkipBack
              size={30}
              className="cursor-pointer"
              onClick={previousVideoHelper}
            />
            {isVideoCompleted ? (
              <RotateCcw
                size={30}
                className="cursor-pointer"
                onClick={() => replayVideo()}
              />
            ) : isPlaying ? (
              <Pause
                size={30}
                className="cursor-pointer"
                onClick={videoPlayPause}
              />
            ) : (
              <Play
                size={30}
                className="cursor-pointer"
                onClick={videoPlayPause}
              />
            )}

            <SkipForward
              size={30}
              className="cursor-pointer"
              onClick={nextVideoHelper}
            />
          </div>
          <div className="text-white flex gap-5 flex-1 items-center justify-end">
            {playerMode === "DEFAULT" && (
              <RectangleHorizontal
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "THEATER")}
              />
            )}
            {playerMode === "THEATER" && (
              <Fullscreen
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "DEFAULT")}
              />
            )}
            {playerMode === "FULLSCREEN" ? (
              <Minimize
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "DEFAULT")}
              />
            ) : (
              <Maximize
                className="cursor-pointer"
                onClick={(e) => switchMode(e, "FULLSCREEN")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
