import React from "react";

const PlaylistBox = ({ Playlist }) => {
  return (
    <div className="flex flex-col items-center p-2 bg-gray-900 text-white rounded-lg w-48 cursor-pointer hover:scale-105 transition-transform">
      {/* Hình ảnh Playlist */}
      <img
        src={Playlist.img}
        //alt={Playlist.Title}
        className="w-40 h-40 rounded-lg object-cover "
      />

      {/* Tiêu đề Playlist */}
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-sm text-gray-300 line-clamp-2">
          {Playlist.Title}
        </h3>
      </div>
    </div>
  );
};

export default PlaylistBox;
