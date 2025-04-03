import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PlaylistBox from "./PlaylistBox";

const PlaylistCarousel = ({ playlists }) => {
  const swiperRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    // Gán ID duy nhất cho Swiper khi component mount
    setUniqueId(`swiper-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

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
          nextEl: isHovered ? `.next-${uniqueId}` : null,
          prevEl: isHovered ? `.prev-${uniqueId}` : null,
        }}
        slidesPerView="auto"
        spaceBetween={24}
        className="!overflow-visible px-4"
      >
        {playlists.map((album, index) => (
          <SwiperSlide key={album.AlbumID} className="!w-auto">
            <PlaylistBox
              playlist={album}
              index={index}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng với ID riêng biệt */}
      <button
        className={`prev-${uniqueId} absolute left-[-5px] top-1/2 -translate-y-1/2 z-20 
        bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center 
        justify-center text-white transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={() => swiperRef.current?.swiper?.slidePrev()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <button
        className={`next-${uniqueId} absolute right-[-30px] top-1/2 -translate-y-1/2 z-20 
        bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center 
        justify-center text-white transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={() => swiperRef.current?.swiper?.slideNext()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};

export default PlaylistCarousel;
