import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext({
  activeVideo: null,
});

const PlayerProvider = ({ children }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const selectVideo = () => {};

  return (
    <PlayerContext.Provider value={{ activeVideo, selectVideo }}>
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
