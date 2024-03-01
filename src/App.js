import React from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";

const App = () => {
  return (
    <div className="h-screen w-full box-border">
      <div className="flex h-full w-full gap-4 max-w-[1750px] mx-auto p-10 box-border">
        <div className="flex-[0.7] border-4">
          <VideoPlayer />
        </div>
        <div className="flex-[0.3]">
          <VideoList />
        </div>
      </div>
    </div>
  );
};

export default App;
