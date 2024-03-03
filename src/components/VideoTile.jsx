import React from "react";
import { usePlayerContext } from "../app/PlayerContext";
import { Draggable } from "react-beautiful-dnd";
import { Menu } from "lucide-react";

const VideoTile = (props) => {
  const data = props.data;
  const { selectVideo } = usePlayerContext();

  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="w-full h-28 flex-shrink-0 flex cursor-pointer group hover:bg-slate-100 rounded-lg select-none bg-white items-center px-1"
          onClick={() => selectVideo(data)}
        >
          {props?.showDND && <Menu size={10} className="mr-2" />}
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
          <div className="flex-[0.5] p-2 pt-1 h-full">
            <span className="text-lg font-medium line-clamp-1">
              {data.title}
            </span>
            <span className="line-clamp-3 leading-5 font-light">
              {data.description}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default VideoTile;
