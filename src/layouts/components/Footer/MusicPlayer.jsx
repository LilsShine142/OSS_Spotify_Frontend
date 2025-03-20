import { useState } from "react";
import { assets } from "../../../assets/assets";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]); // Slider từ shadcn nhận array

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
      {/* Bài hát */}
      <div className="flex items-center gap-3">
        <img
          src={assets.avatar}
          alt="Thumbnail"
          className="w-14 h-14 rounded-md"
        />
        <div>
          <p className="text-sm font-semibold">{assets.song1}</p>
          <p className="text-xs text-gray-400">Nghệ Sĩ</p>
        </div>
      </div>

      {/* Điều khiển phát nhạc */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-5">
          
        </div>

      </div>

      {/* Điều khiển âm lượng & mở rộng */}
      <div className="flex items-center gap-3">
        
       
      </div>
    </div>
  );
};

export default MusicPlayer;