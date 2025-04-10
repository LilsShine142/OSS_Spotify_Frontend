import React, { useState, useEffect } from "react";
import CustomButton from "../../../components/Button/CustomButton";
import BoxCard from "../../../components/BoxCard/BoxCard";
import PlaylistCarousel from "../../../components/BoxCard/PlaylistCarousel";
import { artists, albumsData } from "../../../assets/assets";

const HomeContainer = ({ width }) => {
  const [albumsData2, setAlbumsData2] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchAlbumsData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/spotify_api/new-releases/");
        const albums = await response.json();
        setAlbumsData2(albums); // Set albumsData2 dynamically
      } catch (error) {
        console.error("Error fetching albums data:", error);
      }
    };

    fetchAlbumsData();
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // Set the selected album to display its songs
};
  return (
    <div className="text-white scrollbar-hidden rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      <header className="flex flex-shrink-0 items-center h-[60px] px-4 md:px-10 gap-2 overflow-hidden">
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hidden px-2 md:px-6">
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

          <section className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Nghệ sĩ bạn theo dõi</h2>
              <button className="text-sm font-bold text-gray-400 hover:text-white">
                Xem tất cả
              </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
              <PlaylistCarousel playlists={artists} variant="artist" />
            </div>
          </section>

          <section className="flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">New Releases</h2>
              <button className="text-sm font-bold text-gray-400 hover:text-white">
                Xem tất cả
              </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
              <PlaylistCarousel playlists={albumsData2} variant="playlist" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
