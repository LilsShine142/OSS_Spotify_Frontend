import React from "react";
import { assets } from "../../../assets/assets";

// import SidebarItem from "./SidebarItem";
// import { Plus, ChevronRight, Search, Menu } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      {/* Filter Buttons */}

      {/* Search Bar */}
      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-bold">Your Library</p>
          </div>
        </div>
      </div>

      {/* Playlists */}
    </div>
  );
};

export default Sidebar;
