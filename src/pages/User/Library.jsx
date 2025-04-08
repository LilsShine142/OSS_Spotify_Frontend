// src/layouts/Libraly/Library.jsx
import React, { useState, useEffect } from "react";
import { Heart, Clock } from "lucide-react";
import SongRow from "./SongRow";
import FilterSort from "./FilterSort";
import FooterMain from "../../layouts/components/Footer/FooterMain";

const Library = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Về Với Em",
        artist: "Võ Hạ Trâm, Duy Tran",
        album: "Về Với Em",
        dateAdded: "5 ngày trước",
        duration: 256,
        liked: true,
        cover: "/images/vevoiem.jpg",
      },
      {
        id: 2,
        title: "Trời giấu trời mang đi",
        artist: "AMEE",
        album: "dreAMEE",
        dateAdded: "5 ngày trước",
        duration: 222,
        liked: true,
        cover: "/images/troigiautroimangdi.jpg",
      },
      {
        id: 3,
        title: "Left and Right (Feat. Jung Kook of BTS)",
        artist: "CHARLIE",
        album: "CHARLIE",
        dateAdded: "5 ngày trước",
        duration: 234,
        liked: true,
        cover: "/images/img1.jpg",
      },
    ];
    setSongs(data);
    setFilteredSongs(data);
  }, []);

  const handleToggleLike = (id) => {
    const updated = songs.filter((song) => song.id !== id);
    setSongs(updated);
    setFilteredSongs(updated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-800 to-black text-white">
      {/* Nội dung chính có thể scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 flex items-end space-x-6">
          <img src="/images/BHYT.jpg" className="w-48 h-48 rounded shadow-lg" alt="liked" />
          <div>
            <p className="uppercase text-sm font-semibold">Playlist</p>
            <h1 className="text-6xl font-bold">Bài hát đã thích</h1>
            <p className="mt-2 text-sm">452 Võ Anh Tuấn • {songs.length} bài hát</p>
          </div>
        </div>

        {/* Bộ lọc + Nút play */}
        <div className="px-6">
          <button className="bg-green-500 hover:bg-green-600 rounded-full px-6 py-3 font-semibold mt-6">
            Phát tất cả
          </button>
          <FilterSort songs={songs} setFilteredSongs={setFilteredSongs} />

          {/* Danh sách bài hát */}
          <div className="mt-8">
            {/* Header của bảng */}
            <div className="grid grid-cols-12 px-4 py-2 text-gray-400 border-b border-gray-700 text-sm sticky top-0 bg-purple-900/70 backdrop-blur-sm z-10">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Tiêu đề</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2">Ngày thêm</div>
              <div className="col-span-1 text-right">Time</div>
              <div className="col-span-1 text-right">Liked</div>
            </div>

            {/* Nội dung bài hát */}
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song, index) => (
                <SongRow
                  key={song.id}
                  index={index + 1}
                  song={song}
                  onToggleLike={handleToggleLike}
                />
              ))
            ) : (
              <p className="text-gray-400 mt-4">Không có bài hát nào trong thư viện.</p>
            )}
          </div>
        </div>
        {/* Footer */}
      <FooterMain />
      </div>
    </div>
  );
};

export default Library;
