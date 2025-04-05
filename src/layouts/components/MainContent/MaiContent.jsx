import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import HomeContainer from "./HomeContainer";

const MainContent = ({ sidebarWidth }) => {
  const [extraWidth, setExtraWidth] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    let startX = e.clientX;
    let startExtraWidth = extraWidth;

    const handleMouseMove = (event) => {
      if (!isResizing.current) return;
      let newExtraWidth =
        startExtraWidth + ((event.clientX - startX) / window.innerWidth) * 100;
      setExtraWidth(Math.max(0, Math.min(newExtraWidth, 10)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Tính toán trước giá trị width để tránh lặp toán tử điều kiện
  const baseWidth =
    sidebarWidth >= 1000
      ? `calc(100% - ${sidebarWidth}px + ${extraWidth}%)`
      : `calc(100% - ${sidebarWidth}px - 320px + ${extraWidth}%)`; // 320px là width của RightSidebar

  return (
    <div
      className="flex flex-col h-[78%] pr-2 relative"
      style={{
        width: baseWidth, // W có thể thay đổi
        minWidth: baseWidth, // Đảm bảo không nhỏ hơn baseWidth
      }}
    >
      {/* Chỉ render nội dung con */}
      <Outlet />
      {/* Thanh kéo dãn */}
      <div
        className="absolute h-full right-0.5 w-0.5 cursor-ew-resize bg-transparent hover:bg-gray-400 active:bg-white transition-all duration-200 z-20"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default MainContent;
