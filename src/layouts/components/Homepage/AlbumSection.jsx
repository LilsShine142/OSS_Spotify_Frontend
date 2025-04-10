import React, { useState, useEffect } from "react";
import PlaylistCarousel from "../../../components/BoxCard/PlaylistCarousel";

const AlbumsSection = () => {
    const [albumsData2, setAlbumsData2] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        const fetchAlbumsData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/spotify_api/new-releases/");
                const albums = await response.json();
                setAlbumsData2(albums); // Replace albumsData2 dynamically with fetched data
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
        <section className="flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Releases</h2>
                <button className="text-sm font-bold text-gray-400 hover:text-white">
                    Xem tất cả
                </button>
            </div>
            <div className="flex pb-4 scrollbar-hide -ml-6">
                {/* Pass the updated albumsData2 to PlaylistCarousel */}
                <PlaylistCarousel playlists={albumsData2} variant="playlist" />
            </div>
        </section>
    );
};

export default AlbumsSection;