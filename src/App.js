import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";

const App = () => {
  return (
    <div className="h-screen w-full box-border">
      <div className="flex h-full w-full gap-4 max-w-[1750px] mx-auto p-10 box-border">
        <div className="flex-[0.7] border-4 flex flex-col gap-2">
          <VideoPlayer />
          <div className="flex flex-col gap-1 p-2">
            <span className="text-2xl line-clamp-2 font-bold">
              Elephant Dream Elephant Dream
            </span>
            <span className="line-clamp-5 leading-5 font-normal text-base">
              Introducing Chromecast. The easiest way to enjoy online video and
              music on your TV—for when you want to make Buster's big meltdowns
              even bigger. For $35. Learn how to use Chromecast with Netflix and
              more at google.com/chromecast.
            </span>
          </div>
        </div>
        <div className="flex-[0.3]">
          <VideoList />
        </div>
      </div>
    </div>
  );
};

export default App;
