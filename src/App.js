import React, { useEffect, useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";
import { usePlayerContext } from "./app/PlayerContext";
import { Search } from "lucide-react";
import clsx from "clsx";

const App = () => {
  const { activeVideo, updateSearch, searchedVideos } = usePlayerContext();
  const [searchInput, setSearchInput] = useState("");
  let searchTimeout;

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  }, []);

  const handleSearch = (e) => {
    e.stopPropagation();
    const value = e.target.value;
    setSearchInput(value);

    const updateSearchHelper = () => {
      updateSearch(value);
    };

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(updateSearchHelper, 700);
  };

  return (
    <div className="h-screen w-full box-border">
      <div className="flex flex-col max-w-[1750px] mx-auto h-full w-full pt-10">
        <div className="px-10 box-border flex justify-center items-center">
          <div
            className={clsx(
              "p-2 px-5 border-2 flex gap-1 rounded-full justify-center items-center w-full md:w-1/5",
              {
                "border-red-500":
                  searchInput.length && searchedVideos.length === 0,
              }
            )}
          >
            <input
              type="text"
              className="focus:outline-none w-full"
              onChange={handleSearch}
              value={searchInput}
            />
            <Search size={20} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row h-full w-full gap-4 md:p-10 p-5 box-border">
          <div className="flex-1 md:flex-[0.7] flex flex-col gap-2 rounded-lg">
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
          <div className="flex-1 md:flex-[0.3]">
            <VideoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
