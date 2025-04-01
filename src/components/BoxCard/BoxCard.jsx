import React from "react";

const BoxCard = ({ Playlist, width }) => {
  // Tăng kích thước BoxCard khi MainContent rộng ra, giảm khi thu nhỏ
  const dynamicWidth =
    width >= 65 ? "w-[260px]" : width <= 55 ? "w-[200px]" : "w-[300px]";

  return (
    <div
      className={`p-3 h-[55px] bg-gray-900 text-white rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 ${dynamicWidth}`}
    >
      {/* Hình ảnh Playlist */}
      <img
        src={Playlist.CoverImage}
        alt={Playlist.Title}
        className="w-12 h-12 rounded-md object-cover mr-3"
      />

      {/* Thông tin Playlist */}
      <div className="flex-1 truncate">
        <h3 className="font-semibold text-sm">{Playlist.Title}</h3>
      </div>

      {/* Hiệu ứng nhạc đang phát */}
      <div className="text-green-500 text-xl">▮▮▮</div>
    </div>
  );
};

export default BoxCard;
