import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PlaylistBox from "./PlaylistBox";

const PlaylistCarousel = ({ playlists }) => {
  const swiperRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        navigation={{
          nextEl: isHovered ? ".custom-next" : null,
          prevEl: isHovered ? ".custom-prev" : null,
        }}
        slidesPerView="auto"
        spaceBetween={24}
        className="!overflow-visible px-4"
      >
        {playlists.map((album) => (
          <SwiperSlide key={album.AlbumID} className="!w-auto">
            <PlaylistBox Playlist={album} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng */}
      <div
        className={`custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 
        bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center 
        justify-center text-white transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div
        className={`custom-next absolute right-2 top-1/2 -translate-y-1/2 z-20 
        bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center 
        justify-center text-white transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default PlaylistCarousel;
