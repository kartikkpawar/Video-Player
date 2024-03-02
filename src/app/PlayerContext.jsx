import React, { createContext, useContext, useState } from "react";
import { mediaData } from "../lib/data";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState(mediaData[0]);
  const [videosData, setVideosData] = useState(mediaData);

  const selectVideo = (data) => {
    if (data.id === activeVideo.id) return;
    setActiveVideo(data);
  };

  return (
    <PlayerContext.Provider value={{ activeVideo, selectVideo, videosData }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayerContext must be used within the provider");
  return context;
};

export default PlayerProvider;
