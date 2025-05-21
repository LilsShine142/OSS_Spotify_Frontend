import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import { RenderIcon } from "../../../../components/Button/RenderIcon";
import { getArtistPerformancesSong } from "@/services/ArtistPerformancesService/artistPerformancesService";
const TrackInfo = ({ track }) => {
  const [artistName, setArtistName] = useState("Nghệ sĩ không xác định");
  const isTrackAvailable = !!track;
  const coverImage = isTrackAvailable ? track.coverImage : null;
  const title = isTrackAvailable
    ? track.title ?? "Unknown Title"
    : "No track selected";

  useEffect(() => {
    const fetchArtist = async () => {
      if (!track?.id) return;

      try {
        const token = JSON.parse(localStorage.getItem("userData"))?.token;
        const response = await getArtistPerformancesSong(track.id, token);
        const name = response?.data?.artist?.artist_name;
        if (name) setArtistName(name);
      } catch (error) {
        console.error("Lỗi khi lấy nghệ sĩ:", error);
        setArtistName("Nghệ sĩ không xác định");
      }
    };

    fetchArtist();
  }, [track]);
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
        <div className="text-xs text-gray-400 truncate">{artistName}</div>
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
