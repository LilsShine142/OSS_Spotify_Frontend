import React from "react";

const BoxCard = ({ Playlist }) => {
  return (
    <div className="p-2 bg-gray-900 text-white rounded-lg max-w-xs flex items-center justify-between cursor-pointer hover:bg-gray-800 transition">
      {/* Hình ảnh Playlist */}
      <img
        src={Playlist.img}
        alt={Playlist.Title}
        className="w-12 h-12 rounded-md object-cover mr-2"
      />

      {/* Thông tin Playlist */}
      <div className="flex-1 truncate">
        <h3 className="font-semibold text-lg">{Playlist.Title}</h3>
      </div>

      {/* Hiệu ứng nhạc đang phát */}
      <div className="text-green-500 text-xl">▮▮▮</div>
    </div>
  );
};

export default BoxCard;
