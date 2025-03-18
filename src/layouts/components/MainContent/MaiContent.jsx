import React from "react";
import CustomButton from "../../../components/Button/CustomButton";
import BoxCard from "../../../components/BoxCard/BoxCard";
import PlaylistBox from "../../../components/BoxCard/PlaylistBox";
import { albumsData } from "../../../assets/assets";

const MainContent = () => {
  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {/* Bộ lọc */}
      <div className="flex gap-4 mb-4">
        <CustomButton variant="secondary">Tất cả</CustomButton>
        <CustomButton variant="outline">Nhạc</CustomButton>
        <CustomButton variant="outline">Podcast</CustomButton>
      </div>

      {/* Playlist đang phát */}
      <div className="mb-6">
        <BoxCard Playlist={albumsData.find((album) => album.AlbumID === 1)} />
      </div>

      {/* Danh sách playlist dành cho bạn */}
      <h2 className="text-2xl font-bold mb-4">Dành Cho Bạn</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albumsData.map((album) => (
          <PlaylistBox key={album.id} Playlist={album} />
        ))}
      </div>

      {/* Album và đĩa đơn nổi tiếng */}
      <h2 className="text-2xl font-bold mt-6 mb-4">
        Album và đĩa đơn nổi tiếng
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Nếu có danh sách khác cho album nổi tiếng, đổ dữ liệu vào đây */}
      </div>
    </div>
  );
};

export default MainContent;
