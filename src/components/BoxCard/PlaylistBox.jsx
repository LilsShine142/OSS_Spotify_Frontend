import React from "react";

const PlaylistBox = ({ Playlist }) => {
  return (
    <div className="relative p-2 group ">
      <div
        className="
        flex flex-col items-center 
        text-white rounded-lg 
        w-48 cursor-pointer
        p-2
        bg-transparent  /* Ẩn nền lúc bình thường */
        hover:bg-[#282828]  /* Chỉ hiện nền khi hover */
        transition-all duration-200
        transform origin-center
        group-hover:scale-105
        group-hover:z-10
      "
      >
        {/* Hình ảnh Playlist */}
        <img
          src={Playlist.CoverImage}
          className="w-40 h-40 rounded-lg object-cover mb-2"
        />

        {/* Tiêu đề Playlist */}
        <div className="w-full text-center">
          <h3 className="font-semibold text-sm text-gray-300 line-clamp-2">
            {Playlist.Title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PlaylistBox;
