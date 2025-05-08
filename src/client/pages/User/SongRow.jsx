import React from "react";
import { Heart } from "lucide-react";

const formatDuration = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const SongRow = ({ index, song, onToggleLike }) => {
  return (
    <div className="grid grid-cols-12 px-4 py-2 hover:bg-gray-800 rounded items-center text-sm text-gray-300 min-h-[52px]">
      
      {/* STT */}
      <div className="col-span-1 flex items-center">{index}</div>

      {/* Ảnh + Tiêu đề + Ca sĩ */}
      <div className="col-span-4 flex items-center gap-4 overflow-hidden">
        <img src={song.cover} alt={song.title} className="w-10 h-10 rounded flex-shrink-0" />
        <div className="overflow-hidden">
          <p className="font-semibold text-white truncate">{song.title}</p>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>
      </div>

      {/* Album */}
      <div className="col-span-3 flex items-center truncate">{song.album}</div>

      {/* Ngày thêm */}
      <div className="col-span-2 flex items-center">{song.dateAdded}</div>

      {/* Thời lượng */}
      <div className="col-span-1 flex items-center justify-end">
        {formatDuration(song.duration)}
      </div>

      {/* Nút like */}
      <div className="col-span-1 flex items-center justify-end">
        <button
          onClick={() => onToggleLike(song.id)}
          className="text-pink-500 hover:text-white"
        >
          <Heart size={16} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default SongRow;
