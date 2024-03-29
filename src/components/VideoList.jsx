import React from "react";
import VideoTile from "./VideoTile";
import { usePlayerContext } from "../app/PlayerContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const VideoList = () => {
  const { videosData, setVideosData, searchedVideos } = usePlayerContext();
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log(draggableId);
    if (!destination) return;
    const tempArr = [...videosData];
    tempArr.splice(source.index, 1);
    tempArr.splice(destination.index, 0, videosData[source.index]);
    setVideosData(tempArr);
  };

  if (searchedVideos.length > 0) {
    return (
      <div className="h-full w-full p-4 px-0 md:px-4 flex gap-4 flex-col overflow-y-scroll">
        {searchedVideos.map((video, index) => (
          <VideoTile data={video} key={video.id} index={index} id={video.id} />
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="playlist">
        {(provided) => (
          <div
            className="h-full w-full p-4 px-0 md:px-4 flex gap-4 flex-col overflow-y-scroll"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {videosData.map((video, index) => (
              <VideoTile
                data={video}
                key={video.id}
                index={index}
                id={video.id}
                isDND
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default VideoList;
