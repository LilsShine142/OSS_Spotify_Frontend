
// import React, { useState, useEffect } from "react";
// import Sidebar from "../../layouts/components/Sidebar/Sidebar";
// import Header from "../../layouts/components/Header/Header";
// import Footer from "../../layouts/components/Footer/MusicPlayer";
// import MainContent from "../../layouts/components/MainContent/MaiContent";

// const Home = () => {
//   const [sidebarWidth, setSidebarWidth] = useState(360); // Default width for Sidebar
//   const [isResizing, setIsResizing] = useState(false); // Track resizing state

//   const handleMouseMove = (e) => {
//     if (isResizing) {
//       const newWidth = e.clientX; // Get the mouse position
//       if (newWidth > 150 && newWidth < 500) {
//         // Set min and max width
//         setSidebarWidth(newWidth);
//       }
//     }
//   };

//   const handleMouseUp = () => {
//     if (isResizing) {
//       setIsResizing(false);
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     }
//   };

//   const handleMouseDown = (e) => {
//     e.preventDefault();
//     setIsResizing(true);
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   useEffect(() => {
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, []);

//   return (
//     <div className="h-screen w-full bg-black overflow-hidden">
//       <Header />
//       <div className="flex h-full pt-2 gap-0.5 overflow-hidden">
//         <Sidebar width={sidebarWidth} onResize={setSidebarWidth} />
//         <div
//           style={{ width: `calc(100% - ${sidebarWidth}px)` }}
//           className="overflow-y-auto"
//         >
//           <MainContent />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState } from "react";
import Sidebar from "../../layouts/components/Sidebar/Sidebar";
import Header from "../../layouts/components/Header/Header";
import MainContent from "../../layouts/components/MainContent/MaiContent";

const Home = () => {
  const [sidebarWidth, setSidebarWidth] = useState(360);

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <Header />
      <div className="flex h-full pt-2 gap-0.5 overflow-hidden">
        <Sidebar width={sidebarWidth} onResize={setSidebarWidth} />
        <MainContent sidebarWidth={sidebarWidth} />
      </div>
    </div>
  );
};


export default Home;
