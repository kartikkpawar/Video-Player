import React, { createContext, useContext, useEffect, useState } from "react";
import { mediaData } from "../lib/data";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(mediaData[activeIndex]);
  const [videosData, setVideosData] = useState(mediaData);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [videoRef, setVideoRef] = useState(null);

  useEffect(() => {
    setActiveVideo(videosData[activeIndex]);
  }, [activeIndex]);

  const selectVideo = (data) => {
    if (data.id === activeVideo.id) return;
    setActiveVideo(data);
  };

  const nextVideo = () => {
    if (activeIndex === videosData.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };
  const previousVideo = () => {
    if (activeIndex === 0) {
      setActiveIndex(videosData.length - 1);
    } else {
      setActiveIndex((prev) => prev - 1);
    }
  };
  const updateSearch = (searchParams) => {
    if (!searchParams) {
      setSearchedVideos([]);
      return;
    }
    const filteredData = videosData.filter(
      (video) =>
        video.title.toLowerCase().includes(searchParams.toLowerCase()) ||
        video.description.toLowerCase().includes(searchParams.toLowerCase())
    );
    setSearchedVideos(filteredData);
  };

  const updateVideoRef = (ref) => {
    setVideoRef(ref);
  };

  return (
    <PlayerContext.Provider
      value={{
        activeVideo,
        selectVideo,
        videosData,
        nextVideo,
        previousVideo,
        updateSearch,
        searchedVideos,
        setVideosData,
        updateVideoRef,
        videoRef,
      }}
    >
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
