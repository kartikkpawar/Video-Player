import React from "react";
import { usePlayerContext } from "../app/PlayerContext";

const VideoPlayer = () => {
  const { activeVideo } = usePlayerContext();

  return (
    <video
      className="w-full aspect-video rounded-lg"
      muted
      autoPlay
      src={activeVideo.sources[0]}
    />
  );
};

export default VideoPlayer;
