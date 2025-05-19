import React, { useContext } from "react";
import { assets } from "@/assets/assets";
import { PlayerContext } from "@/context/PlayerContext/PlayerContext"; // Điều chỉnh lại path nếu khác
import { RenderIcon } from "../../../../components/Button/RenderIcon";
const TrackInfo = ({ track }) => {
  if (!track)
    return (
      <div className="flex items-center">
        <div className="w-14 h-14 bg-gray-800 rounded-md animate-pulse" />
        <div className="ml-4">
          <div className="text-sm font-semibold text-gray-400">
            No track selected
          </div>
          <div className="text-xs text-gray-500">Select a song to play</div>
        </div>
      </div>
    );

  return (
    <div className="flex items-center w-1/4 min-w-[180px]">
      <>
        <img
          src={track.cover_image || assets.avatar}
          alt="Ảnh bìa"
          className="w-14 h-14 rounded-md object-cover shadow-md"
        />
        <div className="ml-4 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {track.Title || "Unknown Title"}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {track.Artist || "Nghệ sĩ không xác định"}
          </div>
        </div>
        <button className="ml-4 text-gray-400 hover:text-pink-400 transition-colors">
          <RenderIcon
            iconName={assets.like_icon}
            altText="Yêu thích"
            className="w-4 h-4"
          />
        </button>
      </>
    </div>
  );
};
  

export default TrackInfo;
