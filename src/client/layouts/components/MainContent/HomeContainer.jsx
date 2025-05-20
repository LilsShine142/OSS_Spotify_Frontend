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
  const [activeView, setActiveView] = useState('local');
  const [localAlbums, setLocalAlbums] = useState([]);
  const [localArtists, setLocalArtists] = useState([]);
  const [globalAlbums, setGlobalAlbums] = useState([]);
  const [globalArtists, setGlobalArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeView === 'local') {
          // Fetch local data
          const [albumsResponse, artistsResponse] = await Promise.all([
            fetch('http://127.0.0.1:8000/spotify_app/albums/'),
            fetch('http://127.0.0.1:8000/spotify_app/artists/')
          ]);

          if (!albumsResponse.ok) throw new Error('Failed to fetch local albums');
          if (!artistsResponse.ok) throw new Error('Failed to fetch local artists');

          const albumsData = await albumsResponse.json();
          const artistsData = await artistsResponse.json();

          setLocalAlbums(albumsData.results || albumsData);
          setLocalArtists(artistsData.results || artistsData);
        } else {
          // Fetch global data
          const [albumsResponse, artistsResponse] = await Promise.all([
            fetch('http://127.0.0.1:8000/spotify_api/new-releases/'),
            fetch('http://127.0.0.1:8000/spotify_api/top-artists/')
          ]);

          if (!albumsResponse.ok) throw new Error('Failed to fetch global albums');
          if (!artistsResponse.ok) throw new Error('Failed to fetch global artists');

          const albumsData = await albumsResponse.json();
          const artistsData = await artistsResponse.json();

          setGlobalAlbums(albumsData.results || albumsData);
          setGlobalArtists(artistsData.results || artistsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeView]);

  return (
    <CustomScrollbar className="text-white rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      <header className="flex items-center h-[60px] px-4 md:px-10 gap-2 flex-shrink-0 sticky top-0 z-10 bg-[#0b1728]">
        <CustomButton 
          variant={activeView === 'local' ? 'primary' : 'secondary'} 
          className="truncate"
          onClick={() => setActiveView('local')}
        >
          Local
        </CustomButton>
        <CustomButton 
          variant={activeView === 'global' ? 'primary' : 'secondary'} 
          className="truncate"
          onClick={() => setActiveView('global')}
        >
          Global
        </CustomButton>
      </header>
      <div className="px-2 md:px-6">
        <div className="flex flex-col space-y-8 p-10">
          {isLoading ? (
            <div className="w-full text-center py-4 text-white">Loading...</div>
          ) : (
            <>
              <TopArtistsSection artists={activeView === 'local' ? localArtists : globalArtists} />
              <AlbumsSection albums={activeView === 'local' ? localAlbums : globalAlbums} />
            </>
          )}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default HomeContainer;
