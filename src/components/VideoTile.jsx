import React from "react";
import { usePlayerContext } from "../app/PlayerContext";

const VideoTile = ({ data }) => {
  const { selectVideo } = usePlayerContext();
  return (
    <div
      className="w-full h-28 flex-shrink-0 flex cursor-pointer group hover:bg-slate-100 rounded-lg select-none hover:select-auto"
      onClick={() => selectVideo(data)}
    >
      <div className="relative flex-[0.5] h-full w-full flex-shrink-0">
        <img
          src={`https://storage.googleapis.com/gtv-videos-bucket/sample/${data.thumb}`}
          alt="Video thumbnail"
          className="object-cover h-full w-full rounded-lg"
          loading="lazy"
        />
        <span className="absolute bottom-1 right-2 bg-black text-white p-1 text-xs rounded-md">
          {data.duration}
        </span>
      </div>
      <div className="flex-[0.5] p-2 pt-1">
        <span className="text-lg font-medium line-clamp-1">{data.title}</span>
        <span className="line-clamp-3 leading-5 font-light">
          {data.description}
        </span>
      </div>
    </div>
  );
};

export default VideoTile;
