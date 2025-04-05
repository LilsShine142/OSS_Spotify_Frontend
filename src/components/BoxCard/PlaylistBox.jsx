import React from "react";
import BoxCard from "./BoxCard";

const PlaylistBox = ({
  playlist,
  variant,
  index,
  hoverIndex,
  setHoverIndex,
}) => {
  return (
    <div
      className={`relative p-2 ${index > 0 ? "ml-[-45px]" : ""}`}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
    >
      <BoxCard
        playlist={playlist}
        variant={variant}
        isHovered={hoverIndex === index}
      />
    </div>
  );
};

export default PlaylistBox;
