import React, { useState, useRef, useEffect, useCallback } from "react";
import { assets } from "../../../assets/assets";
import { BiListUl, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Playlists from "../../components/Playlist/Playlists";

const Sidebar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [width, setWidth] = useState(360);
  const inputRef = useRef(null);
  const sidebarRef = useRef(null);
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Hàm kiểm tra khả năng cuộn trái/phải của danh sách
  const checkScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = listRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollWidth > clientWidth + scrollLeft);
  }, [width]);

  // Gọi checkScroll khi component render
  useEffect(() => {
    checkScroll();
  }, [width, checkScroll]);

  // Lắng nghe sự kiện scroll trên danh sách
  useEffect(() => {
    const list = listRef.current;
    if (list) list.addEventListener("scroll", checkScroll);
    return () => list?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  // Hàm cuộn danh sách trái/phải
  const scrollList = (direction) => {
    listRef.current?.scrollBy({
      left: direction === "left" ? -130 : 130,
      behavior: "smooth",
    });
  };

  // Hàm mở input tìm kiếm
  const handleOpenSearch = () => {
    if (!isFocused) {
      setIsFocused(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Cập nhật chiều rộng sidebar khi resize màn hình
  const updateSidebarWidth = useCallback(() => {
    const currentWidth = window.innerWidth;
    setWidth(currentWidth < 1100 ? 86 : currentWidth < 1250 ? 300 : 360);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateSidebarWidth();
      checkScroll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateSidebarWidth, checkScroll]);

  // Xử lý kéo thả để thay đổi kích thước sidebar
  const handleMouseDown = (e) => {
    let startX = e.clientX;
    let startWidth = width;
    let isResizing = true;

    const handleMouseMove = (event) => {
      if (!isResizing || !sidebarRef.current) return;
      const newWidth = startWidth + (event.clientX - startX);
      setWidth(
        newWidth < 190 ? 85 : newWidth < 300 ? 300 : newWidth < 650 ? 360 : 1000
      );
    };

    const handleMouseUp = () => {
      isResizing = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      className="h-full p-2 flex flex-col gap-2 text-white relative"
      style={{
        width: `${width}px`,
        minWidth: "85px",
        maxWidth: "100vw",
      }}
    >
      <div className="bg-[#121212] h-[87%] rounded">
        {/* Header */}
        <header>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img className="w-6 ml-2" src={assets.stack_icon} alt="" />
              {width > 86 && <p className="font-bold">Thư viện</p>}
            </div>

            {width > 86 && (
              <div className="flex items-center gap-3">
                <img className="w-4" src={assets.plus_icon} alt="" />
                <img className="w-4" src={assets.arrow_icon} alt="" />
              </div>
            )}
          </div>
        </header>

        {width > 86 && (
          <>
            {/* Danh sách lọc */}
            <div className="relative flex items-center px-4 py-2">
              {canScrollLeft && (
                <button
                  className="absolute left-0 bg-[#242424] p-2 rounded-full text-white z-10 hover:brightness-125"
                  onClick={() => scrollList("left")}
                >
                  <BiChevronLeft size={20} />
                </button>
              )}

              <div
                ref={listRef}
                className="flex gap-2 overflow-x-auto whitespace-nowrap scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {["Danh sách phát", "Nghệ sĩ", "Album"].map((item, index) => (
                  <button
                    key={index}
                    className="bg-[#242424] text-white px-4 py-1 text-sm font-bold rounded-full hover:scale-105 transition-transform duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {canScrollRight && (
                <button
                  className="absolute right-0 bg-[#242424] p-2 rounded-full text-white z-10 hover:brightness-125"
                  onClick={() => scrollList("right")}
                >
                  <BiChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Tìm kiếm */}
            <div className="flex items-center justify-between mb-4 px-3 py-2">
              <div
                className={`flex items-center px-3 py-2 transition-[width,background-color] duration-300 ${
                  isFocused
                    ? "w-72 bg-[#242424] rounded-lg"
                    : "w-10 hover:bg-[#242424] rounded-full"
                }`}
              >
                <img
                  className={`w-5 transition-opacity duration-200 ${
                    isFocused
                      ? "opacity-50 cursor-text pointer-events-none"
                      : "opacity-100 cursor-pointer"
                  }`}
                  src={assets.search_icon}
                  alt="Search"
                  onClick={isFocused ? undefined : handleOpenSearch}
                />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Bạn muốn phát nội dung gì?"
                  className={`bg-transparent text-white text-sm font-semibold transition-all duration-300 ${
                    isFocused ? "w-full ml-2" : "w-0"
                  } outline-none h-7 px-2 rounded-lg`}
                  onBlur={() => setIsFocused(false)}
                />
              </div>

              <div className="text-gray-400 text-sm flex items-center gap-1 overflow-hidden">
                <span
                  className={`transition-all duration-300 ${
                    isFocused ? "hidden opacity-0 w-0" : "opacity-100 w-auto"
                  }`}
                >
                  Gần đây
                </span>
                <BiListUl size={24} />
              </div>
            </div>
          </>
        )}
        {/* Danh sách phát */}
        <Playlists width={width} />
      </div>

      {/* Thanh kéo dãn */}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-gray-500 opacity-50 hover:opacity-100"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default Sidebar;
