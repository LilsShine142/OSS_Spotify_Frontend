import React from "react";
import BoxCard from "./BoxCard";

const PlaylistBox = ({ playlist, index, hoverIndex, setHoverIndex }) => {
  return (
    <div
      className={`relative p-2 ${index > 0 ? "ml-[-45px]" : ""}`}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <BoxCard
        playlist={playlist}
        variant="playlist"
        index={index}
        hoverIndex={hoverIndex}
      />
      {/* <div
        className={`
          flex flex-col items-center 
          text-white rounded-lg 
          w-48 cursor-pointer
          py-4
          bg-transparent 
          transition-all duration-200
          transform origin-center
          ${hoverIndex === index ? "bg-[#282828] scale-105 z-10" : ""}
        `}
      ></div> */}
    </div>
  );
};

export default PlaylistBox;
