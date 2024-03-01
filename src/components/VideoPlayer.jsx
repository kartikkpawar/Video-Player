import React from "react";

const temp_sources = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
];

const VideoPlayer = () => {
  return (
    <video className="w-full aspect-video" autoPlay muted>
      {temp_sources.map((source) => (
        <source src={source} type="video/mp4" />
      ))}
    </video>
  );
};

export default VideoPlayer;
