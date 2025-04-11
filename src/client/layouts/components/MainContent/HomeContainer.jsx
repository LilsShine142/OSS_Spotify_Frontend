import React, { useState, useEffect } from "react";
import { fetchNewReleases } from "../../../../services/SpotifyAPI/spotifyService";
import CustomButton from "../../../../components/Button/CustomButton";
import BoxCard from "../../../../components/BoxCard/BoxCard";
import PlaylistCarousel from "../../../../components/BoxCard/PlaylistCarousel";
import { artists, albumsData } from "../../../../assets/assets";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
import TopArtistsSection from "../Homepage/TopArtistsSection";
import AlbumsSection from "../Homepage/AlbumsSection";

const HomeContainer = ({ width }) => {
  
  return (
    <CustomScrollbar className="text-white rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      <header className="flex items-center h-[60px] px-4 md:px-10 gap-2 flex-shrink-0">
        <CustomButton variant="primary" className="truncate">
          Tất cả
        </CustomButton>
        <CustomButton variant="secondary" className="truncate">
          Nhạc
        </CustomButton>
        <CustomButton variant="secondary" className="truncate">
          Podcast
        </CustomButton>
      </header>
      <div className="px-2 md:px-6">
        <div className="flex flex-wrap gap-4 p-4">
          {albumsData
            // Sau này sửa lại xét các album nghe nhiều sẽ được hiển thị ở đây
            .slice(0, width > 1024 ? 6 : width < 768 ? 3 : 4)
            .map((album) => (
              <BoxCard
                key={album.AlbumID}
                playlist={album}
                width={width}
                variant="list"
              />
            ))}
        </div>

        <div className="flex flex-col space-y-8 p-10">
          {/* <section className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dành cho bạn</h2>
              <button className="text-sm font-bold text-gray-400 hover:text-white">
                Xem tất cả
              </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
              <PlaylistCarousel playlists={albumsData} variant="playlist" />
            </div>
          </section> */}

          <TopArtistsSection />
          <AlbumsSection />

          
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default HomeContainer;
