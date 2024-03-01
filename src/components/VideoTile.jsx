import React from "react";

const VideoTile = () => {
  return (
    <div className="w-full h-28 flex-shrink-0 flex cursor-pointer group hover:bg-slate-100 rounded-lg">
      <div className="relative flex-[0.5] h-full w-full">
        <img
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
          alt=""
          className="object-cover h-full w-full rounded-lg"
        />
        <span className="absolute bottom-1 right-2 bg-black text-white p-1 text-xs rounded-md">
          14:26
        </span>
      </div>
      <div className="flex-[0.5] p-2 pt-1">
        <span className="text-lg font-medium line-clamp-1">
          Elephant Dream Elephant Dream
        </span>
        <span className="line-clamp-3 leading-5 font-light">
          Introducing Chromecast. The easiest way to enjoy online video and
          music on your TV—for when you want to make Buster's big meltdowns even
          bigger. For $35. Learn how to use Chromecast with Netflix and more at
          google.com/chromecast.
        </span>
      </div>
    </div>
  );
};

export default VideoTile;
