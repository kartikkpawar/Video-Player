import React from "react";
import VideoTile from "./VideoTile";
import { usePlayerContext } from "../app/PlayerContext";

const VideoList = () => {
  const { videosData } = usePlayerContext();

  return (
    <div className="h-full w-full p-4 flex gap-4 flex-col overflow-y-scroll">
      {videosData.map((video) => (
        <VideoTile data={video} key={video.id} />
      ))}
    </div>
  );
};

export default VideoList;
