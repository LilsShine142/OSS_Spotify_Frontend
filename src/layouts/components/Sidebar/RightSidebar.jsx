import React from "react";
import { assets, albumsData, songDetails } from "../../../assets/assets";

const RightSidebar = ({ sidebarWidth, currentSongId }) => {
  if (sidebarWidth >= 1000) {
    return null;
  }

  const currentSongDetails = songDetails.find(
    (song) => song.songId === currentSongId
  );
  const displayData = currentSongDetails || albumsData[0];

  // Thông tin nghệ sĩ
  const artistInfo = {
    name: "Jack - J97",
    monthlyListeners: "196.965 người nghe hằng tháng",
    description: "Trịnh Trần Phương Tuấn ( aka Jack aka J97 aka Bocon...)",
    songs: ["Chúng Ta Rồi Sẽ Hạnh Phúc", "Sóng Gió", "Hồng Nhan"],
    image: displayData.coverImage || "assets/jack-j97.jpg",
  };

  return (
    <aside
      className="w-80 h-[78%] bg-[#181818] border-l border-gray-800 hidden lg:flex flex-col relative overflow-y-auto scrollbar-hide"
      style={{ width: "320px" }}
    >
      {/* Ảnh nền */}
      <div className="absolute inset-0">
        <img
          src={artistInfo.image}
          alt={displayData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#181818]" />
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header (Hiện playlist của bài hát đang chọn)*/}
        <div className="p-6 pt-8">
          <h1 className="text-xl font-bold text-white mb-1">Daily Mix 3</h1>
          <div className="h-px bg-gray-600 my-3"></div>
        </div>

        {/* Thông tin nghệ sĩ - Đẩy xuống 1/3 ảnh */}
        <div className="flex-1 p-6 mt-[33vh]">
          <h2 className="text-xl font-bold text-white">{displayData.title}</h2>
          <p className="text-sm text-gray-400">{displayData.artist}</p>
          {/* Thêm mt-[33vh] để đẩy xuống */}
          <h3 className="text-lg font-semibold text-white mb-4">
            Giới thiệu về nghệ sĩ
          </h3>

          <div className="bg-[#282828] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 mb-3">
              <img
                src={artistInfo.image}
                alt={artistInfo.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-md font-bold text-white">
                  {artistInfo.name}
                </h4>
                <p className="text-xs text-gray-400">
                  {artistInfo.monthlyListeners}
                </p>
              </div>
            </div>
            <button className="w-full bg-white text-black py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
              Theo dõi
            </button>
            <div className="mb-6">
              <p className="text-sm text-gray-300">{artistInfo.description}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-md font-semibold text-white mb-3">
              Các bài hát nổi bật
            </h3>
            <ul className="space-y-3">
              {artistInfo.songs.map((song, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors"
                >
                  {song}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
