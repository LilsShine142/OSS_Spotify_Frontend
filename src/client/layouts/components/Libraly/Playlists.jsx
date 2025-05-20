import React, { useState, useEffect } from "react";
import { assets } from "../../../../assets/assets";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
import { getFavoriteSongsSummary } from "../../../../services/MusicLibraryService/FavoriteSong";
import { getAllsPlaylists } from "../../../../services/SpotifyAppService/Playlists";
import { getAllsArtistFollowed } from "../../../../services/SpotifyAppService/FollowService";
import Cookies from "js-cookie";
import { IoPlay } from "react-icons/io5";
import { Link } from "react-router-dom";
const PlaylistItem = ({ item, width, type }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getItemInfo = () => {
    if (type === "likedsongs") return { id: item._id, type: "likedsongs" };
    if (type === "playlist") return { id: item._id, type: "playlist" };
    if (type === "artist") return { id: item._id, type: "artist" };
    return {
      id: item.id,
      type: item.type || "album", // Tùy xem db có type hay không
    };
  };

  const { id } = getItemInfo();
  return (
    <Link
      to={
        type === "likedsongs"
          ? `/collection/${type}`
          : type && id
          ? `/${type}/${id}`
          : "/default-page"
      } // Không / trước type thì cần giữ trong layout /home, tạm thời gắn default-page, sau có thể bỏ và áp dụng cho trang khác
      state={{ fromHome: true }}
      className="relative"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center pr-1 mr-1 w-full gap-3 px-3 py-2 hover:bg-[#242424] rounded-lg cursor-pointer"
      >
        <div className="relative w-12 h-12">
          <img
            src={item.image || assets.avatar}
            alt={item.name}
            className={`w-12 h-12 object-cover ${
              type === "artists" ? "rounded-full" : "rounded-md"
            }`}
          />
          {/* Nút Play xuất hiện khi hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40
          ${type === "artists" ? "rounded-full" : "rounded-md"}
          ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}
          >
            <IoPlay size={20} className="text-white" />
          </div>
        </div>
        {width > 86 && (
          <div>
            <p className="text-white font-semibold">
              {item.name || item.title || item.artist_name}
            </p>
            {type === "likedsongs" ? (
              <p className="text-gray-400 text-sm">
                Danh sách phát • {item.total || 0} bài hát
              </p>
            ) : type === "playlist" ? (
              <p className="text-gray-400 text-sm">
                Danh sách phát • {item.user_id}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                {item.description || "Nghệ sĩ"}
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

const Playlists = ({ width }) => {
  const [likedSongs, setLikedSongs] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    const userDataStorage = JSON.parse(localStorage.getItem("userData"));
    console.log("userDataStorage", userDataStorage);

    const fetchLikedSongs = async () => {
      // if (!token || !userDataStorage?.user?.id) {
      //   console.warn("Thiếu token hoặc user ID");
      //   return;
      // }

      try {
        const response = await getFavoriteSongsSummary(
          userDataStorage.user.data._id,
          userDataStorage.token
        );
        if (response.success) {
          console.log("response", response);
          setLikedSongs(response.favoriteSongs || {}); // Hoặc response.data tùy cấu trúc API
          console.log("Danh sách bài hát đã thích:", response.favoriteSongs);
        } else {
          console.error("Không lấy được danh sách bài hát đã thích");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API bài hát đã thích:", error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await getAllsPlaylists(
          userDataStorage.user.data._id,
          userDataStorage.token
        );
        if (response.success) {
          console.log("response", response);
          setPlaylists(response.Playlists.data || []);
          console.log("Playlists cá nhân:", response.Playlists);
        } else {
          console.error("Không lấy được Playlists cá nhân");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API Playlists:", error);
      }
    };

    const fetchartists = async () => {
      try {
        const response = await getAllsArtistFollowed(
          userDataStorage.user.data._id,
          userDataStorage.token
        );
        if (response.success) {
          console.log("response", response);
          setArtists(response.artists.artists || []);
          console.log("Artists đã theo dõi:", response.artists.artists);
        } else {
          console.error("Không lấy được Artists đã theo dõi");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API Artists:", error);
      }
    };

    fetchLikedSongs();
    fetchPlaylists();
    fetchartists();
  }, []);

  return (
    <CustomScrollbar
      className={`container mx-auto w-full ${
        width > 86 ? "max-h-[76%]" : "max-h-[92%]"
      } overflow-auto pr-2 `}
    >
      {/* Bài hát đã thích */}
      <PlaylistItem item={likedSongs} width={width} type="likedsongs" />
      {/* Danh sách phát cá nhân */}
      {playlists.map((playlist) => (
        <PlaylistItem item={playlist} width={width} type="playlist" />
      ))}
      {/* Nghệ sĩ đã theo dõi */}
      {artists.map((artist) => (
        <PlaylistItem item={artist} width={width} type="artist" />
      ))}
    </CustomScrollbar>
  );
};

export default Playlists;
