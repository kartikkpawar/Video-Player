import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";
import { usePlayerContext } from "./app/PlayerContext";

const App = () => {
  const { activeVideo } = usePlayerContext();

  return (
    <div className="h-screen w-full box-border">
      <div className="flex h-full w-full gap-4 max-w-[1750px] mx-auto p-10 box-border">
        <div className="flex-[0.7] flex flex-col gap-2 rounded-lg">
          <VideoPlayer />
          <div className="flex flex-col gap-1 p-2">
            <span className="text-2xl line-clamp-2 font-bold select-none hover:select-auto">
              {activeVideo?.title}
            </span>
            <span className="line-clamp-5 leading-5 font-normal text-base select-none hover:select-auto">
              {activeVideo?.description}
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
