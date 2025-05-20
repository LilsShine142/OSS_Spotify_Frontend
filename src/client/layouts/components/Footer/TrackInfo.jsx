import React from "react";
import { assets } from "@/assets/assets";
import { RenderIcon } from "../../../../components/Button/RenderIcon";

const TrackInfo = ({ track }) => {
  const isTrackAvailable = !!track;

  const coverImage = isTrackAvailable ? track.cover_image : null;
  const title = isTrackAvailable
    ? track.Title ?? "Unknown Title"
    : "No track selected";
  const artist = isTrackAvailable
    ? track.Artist ?? "Nghệ sĩ không xác định"
    : "Select a song to play";

  return (
    <div className="flex items-center w-1/4 min-w-[180px]">
      <div className="w-14 h-14 bg-gray-800 rounded-md overflow-hidden shadow-md">
        {isTrackAvailable ? (
          <img
            src={coverImage || assets.avatar}
            alt="Ảnh bìa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-700" />
        )}
      </div>

      <div className="ml-4 min-w-0">
        <div
          className={`text-sm font-medium truncate ${
            isTrackAvailable ? "text-white" : "text-gray-400"
          }`}
        >
          {title}
        </div>
        <div className="text-xs text-gray-400 truncate">{artist}</div>
      </div>

      {isTrackAvailable && (
        <button className="ml-4 text-gray-400 hover:text-pink-400 transition-colors">
          <RenderIcon
            iconName={assets.like_icon}
            altText="Yêu thích"
            className="w-4 h-4"
          />
        </button>
      )}
    </div>
  );
};

export default TrackInfo;
