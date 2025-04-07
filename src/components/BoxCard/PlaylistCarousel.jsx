import React, { useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PlaylistBox from "./PlaylistBox";

const PlaylistCarousel = ({ playlists, variant }) => {
  const swiperRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Sử dụng useMemo để tránh tạo lại id khi re-render
  const uniqueId = useMemo(
    () => `swiper-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // Tối ưu hàm getUniqueKey với useMemo
  const getUniqueKey = useMemo(() => {
    return (item) => {
      const idTypes = [
        { key: "AlbumID", prefix: "album" },
        { key: "ArtistID", prefix: "artist" },
        { key: "PlaylistID", prefix: "playlist" },
        { key: "SongID", prefix: "song" },
      ];

      for (const { key, prefix } of idTypes) {
        if (item[key]) return `${prefix}-${item[key]}`;
      }

      return item.id
        ? `item-${item.id}`
        : `item-${Math.random().toString(36).substr(2, 9)}`;
    };
  }, []);

  // Tối ưu navigation config
  const navigationConfig = useMemo(
    () => ({
      nextEl: isHovered ? `.next-${uniqueId}` : null,
      prevEl: isHovered ? `.prev-${uniqueId}` : null,
    }),
    [isHovered, uniqueId]
  );

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        navigation={navigationConfig}
        slidesPerView="auto"
        spaceBetween={24}
        className="!overflow-visible px-4"
      >
        {playlists.map((item, index) => (
          <SwiperSlide key={getUniqueKey(item)} className="!w-auto">
            <PlaylistBox
              playlist={item}
              variant={variant}
              index={index}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <button
        className={`prev-${uniqueId} absolute left-[-5px] top-1/2 -translate-y-1/2 z-20 
        bg-black/70 hover:bg-black/90 w-10 h-10 rounded-full flex items-center 
        justify-center text-white transition-opacity duration-300
        ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={() => swiperRef.current?.swiper?.slidePrev()}
        aria-label="Previous"
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
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
};

export default React.memo(PlaylistCarousel);