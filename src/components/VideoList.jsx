import React from "react";
import VideoTile from "./VideoTile";

const temp_loop = Array(10).fill("");

const VideoList = () => {
  return (
    <div className="h-full w-full border-4 p-4 flex gap-4 flex-col overflow-y-scroll">
      {temp_loop.map((item) => (
        <VideoTile data={item} />
      ))}
    </div>
  );
};

export default VideoList;
