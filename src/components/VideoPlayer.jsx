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
  SkipBack,
  SkipForward,
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
  const { activeVideo } = usePlayerContext();
  const [hoverFocus, setHoverFocus] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMode, setPlayerMode] = useState("DEFAULT");
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
  }, []);

  const videoPlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }
    videoRef.current.play();
    setIsPlaying(true);
  };

  const switchMode = (mode) => {
    setPlayerMode(mode);
  };

  const manageSpeedControls = (e) => {
    e.stopPropagation();
    setShowSpeedOptions(!showSpeedOptions);
  };

  const setSpeed = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  };

  const playerClickHelper = () => {
    setShowSpeedOptions(false);
  };

  return (
    <div
      className="aspect-video relative"
      onMouseEnter={() => setHoverFocus(true)}
      onMouseLeave={() => {
        setHoverFocus(false);
        setShowSpeedOptions(false);
      }}
      onClick={playerClickHelper}
    >
      <video
        className="w-full h-full rounded-lg"
        muted
        src={activeVideo.sources[0]}
        ref={videoRef}
      />
      <div
        className={clsx(
          "flex flex-col absolute bottom-2 w-full text-white px-2 transition-all ease-in-out duration-150",
          { "opacity-100": hoverFocus, "opacity-0": !hoverFocus }
        )}
      >
        <div className="w-full">
          <div className="w-full h-1 hover:h-2 transition-all">
            <div className="w-full h-full rounded-full bg-red-500" />
          </div>
          <div className="flex justify-between mt-1 px-2 select-none hover:select-auto">
            <span>0:10</span>
            <span>{activeVideo.duration}</span>
          </div>
        </div>
        <div className="my-2 px-3 flex">
          <div className="text-white flex gap-5 flex-1 items-center justify-start relative">
            <div
              className={clsx(
                "flex flex-col bg-black/70 absolute -top-60 -left-2 p-3 rounded-lg text-lg text-center gap-1 w-32 transition-all select-none z-10",
                {
                  "opacity-100": showSpeedOptions,
                  "opacity-0": !showSpeedOptions,
                }
              )}
            >
              {Object.entries(speedOptions)
                .sort(([aKey], [bKey]) => aKey - bKey)
                .map(([key, value]) => (
                  <span
                    className={clsx("hover:font-bold cursor-pointer", {
                      "font-bold": playbackSpeed.toString() === key,
                    })}
                    onClick={() => setSpeed(key)}
                  >
                    {value}
                  </span>
                ))}
            </div>
            <Gauge className="cursor-pointer" onClick={manageSpeedControls} />
          </div>
          <div className="text-white flex gap-5 flex-1 items-center justify-center">
            <SkipBack size={30} className="cursor-pointer" />
            {isPlaying ? (
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
            <SkipForward size={30} className="cursor-pointer" />
          </div>
          <div className="text-white flex gap-5 flex-1 items-center justify-end">
            {playerMode === "DEFAULT" && (
              <RectangleHorizontal
                className="cursor-pointer"
                onClick={() => switchMode("THEATER")}
              />
            )}
            {playerMode === "THEATER" && (
              <Fullscreen
                className="cursor-pointer"
                onClick={() => switchMode("DEFAULT")}
              />
            )}
            {playerMode === "FULLSCREEN" ? (
              <Minimize
                className="cursor-pointer"
                onClick={() => switchMode("DEFAULT")}
              />
            ) : (
              <Maximize
                className="cursor-pointer"
                onClick={() => switchMode("FULLSCREEN")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
