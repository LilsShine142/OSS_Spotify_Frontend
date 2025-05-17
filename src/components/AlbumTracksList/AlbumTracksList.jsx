import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchAlbumDataByID,
  fetchAlbumTracksList,
  fetchArtistInfo,
} from "../../services/SpotifyAPI/spotifyService";
import { getSpotifyAccessToken } from "@/services/SpotifyAPI/spotifyAccessTokenService";
import CustomScrollbar from "../Scrollbar/CustomScrollbar";
import { assets } from "@/assets/assets";
import PlayButton from "../Button/PlayButton";
import { RenderIcon } from "../Button/RenderIcon";
import { CiSaveDown1 } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import LoadingSpinner from "../Loading/LoadingSpinner";

const AlbumTracksList = () => {
  const { id: albumId } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  const [bestImage, setBestImage] = useState({
    url: "/default-image.png",
    width: 60,
    height: 60,
  });

  useEffect(() => {
    const fetchAlbumData = async () => {
      const accessToken = await getSpotifyAccessToken(); // Lấy access token từ Spotify
      // const accessToken =
      //   "BQDIojhsPiB14vZ_mYix88zSW9tbh7OXsU0FPKR_CFPx8JtsqG-Na0p9XiluhD30zc4gzx6OAm_ytYdIZ32m-ZenEBf3Paq4HjTBWrcUwI_6v5geBuLMvrxREM1Ag1CaKoXY9VXy1qc";
      console.log("accessToken", accessToken); // Kiểm tra access token
      try {
        // Tạm thời gắn prams như vậy
        const params = {
          offset: 0,
          limit: 50,
        };
        const albumInfo = await fetchAlbumDataByID(albumId, accessToken);
        const tracksList = await fetchAlbumTracksList(
          albumId,
          params,
          accessToken
        );
        console.log("albumInfo", albumInfo); // Kiểm tra thông tin bài hát
        console.log("artistId", albumInfo.artists[0].id); // Kiểm tra thông tin bài hát
        if (albumInfo && albumInfo.artists[0].id) {
          const artist = await fetchArtistInfo(
            albumInfo.artists[0].id,
            accessToken
          );
          console.log("artist", artist);
          setArtistInfo(artist);
        }

        console.log("artistInfo", artistInfo); // Kiểm tra danh sách bài hát
        setAlbumData(albumInfo);
        setTracks(tracksList.items);
        setLoading(false);

        getBestImage(albumInfo.images); // Cập nhật ảnh lần đầu
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  // Hàm chọn ảnh phù hợp
  const getBestImage = (images) => {
    if (!images || images.length === 0) {
      setBestImage({ url: "/default-image.png", width: 50, height: 50 });
    }

    const screenWidth = window.innerWidth;
    console.log("screenWidth", screenWidth);
    let selectedImage = {};

    // Tùy theo độ rộng màn hình, lấy ảnh phù hợp
    if (screenWidth > 1024) {
      // Màn hình lớn (desktop)
      selectedImage = { url: images[0].url, width: 60, height: 60 } || {
        url: "/default-image.png",
        width: 60,
        height: 60,
      };
    } else if (screenWidth > 840) {
      // Màn hình trung bình (tablet)
      selectedImage = { url: images[1].url, width: 50, height: 50 } || {
        url: "/default-image.png",
        width: 50,
        height: 50,
      };
    } else {
      // Màn hình nhỏ (mobile)
      selectedImage = { url: images[2].url, width: 40, height: 40 } || {
        url: "/default-image.png",
        width: 40,
        height: 40,
      };
    }

    // Cập nhật state với ảnh đã chọn
    setBestImage(selectedImage);
  };

  // Cập nhật ảnh khi resize màn hình
  useEffect(() => {
    const handleResize = () => {
      if (albumData) {
        getBestImage(albumData.images);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [albumData]);

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000); // 1 giờ = 3600000ms
    const minutes = Math.floor((ms % 3600000) / 60000); // 1 phút = 60000ms

    // Trả về chuỗi dạng "giờ phút giây"
    let result = "";
    if (hours > 0) {
      result += `${hours} giờ`;
    }
    if (minutes > 0) {
      if (result) result += " "; // Thêm khoảng trắng nếu đã có phần giờ
      result += `${minutes} phút`;
    }
    return result;
  };

  const formatDurationForEachSong = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getCredits = (trackArtists) => {
    if (trackArtists.length <= 1) return "";
    return trackArtists
      .slice(1)
      .map((artist) => artist.name)
      .join(", ");
  };

  const handlePlayButtonClick = (trackId) => {
    if (isPlaying && currentTrackId === trackId) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentTrackId(trackId);
    }
  };
  // Hàm tách chuỗi date chỉ lấy năm
  const getYearFromDate = (dateString) => {
    const date = new Date(dateString); // Chuyển chuỗi thành đối tượng Date
    return date.getFullYear(); // Trả về năm từ đối tượng Date
  };

  if (loading)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div> */}
        <LoadingSpinner size="xl" color="primary" />
      </div>
    );
  if (error) return <div className="text-red-500 p-4">Lỗi: {error}</div>;
  if (!albumData)
    return <div className="text-white p-4">Không tìm thấy dữ liệu album</div>;
  console.log("image", bestImage); // Kiểm tra ảnh bìa album
  console.log("albumData", albumData); // Kiểm tra danh sách bài hát
  //const albumImageUrl = getBestImage(albumData); // Lấy ảnh bìa album
  /// console.log("albumImageUrl", albumImageUrl); // Kiểm tra ảnh bìa album

  // Tính tổng thời gian album (tính bằng mili giây)
  const totalDurationMs = tracks.reduce(
    (total, track) => total + track.duration_ms,
    0
  );

  // Tính tổng thời gian album sau khi tính toán
  const formattedTotalDuration = formatDuration(totalDurationMs);
  return (
    <CustomScrollbar className="text-white rounded flex flex-col h-full bg-gradient-to-b from-[#0d1a2d] to-black">
      {/* Album Header */}
      <div className="w-full pb-4">
        <div className="flex items-end gap-6 px-6 pt-8">
          <div className="flex-shrink-0">
            <img
              src={bestImage.url || "default-image.png"}
              alt="Ảnh bìa album"
              className={`w-${bestImage.width || 50} h-${
                bestImage.height || 50
              } md:w-30 md:h-30 object-cover shadow-xl rounded-md`}
            />
          </div>
          {albumData && (
            <div className="flex flex-col justify-end">
              <span className="text-xs uppercase text-[#b3b3b3] mb-2">
                {albumData.type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {albumData.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={artistInfo.images[0].url || "default-image.png"}
                    alt="Nghệ sĩ"
                    className="w-8 h-8 object-cover"
                  />
                </div>

                <span>
                  {albumData.artists[0].name || ""} •{" "}
                  {getYearFromDate(albumData.release_date)} •{" "}
                  {albumData.total_tracks} bài hát,{" "}
                  {formattedTotalDuration || ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4 py-4 p-20">
          <div className="relative">
            <PlayButton
              isActive={true}
              size="medium"
              itemId={2}
              itemType="album"
              variant="list"
              isPlaying={isPlaying}
              onTogglePlay={handlePlayButtonClick}
            />
          </div>

          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.shuffle_icon}
              altText="Xáo trộn"
              className="w-6 h-6"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.plus_icon}
              altText="Thêm"
              className="w-6 h-6"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              icon={CiSaveDown1}
              altText="Tải xuống"
              className="w-8 h-8 hover:text-white"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              icon={HiDotsHorizontal}
              altText="Thêm tùy chọn"
              className="w-8 h-8 hover:text-white"
            />
          </button>
        </div>
      </div>

      <div className="px-6">
        {/* Header - Tiêu đề cột */}
        <div className="grid grid-cols-12 gap-4 items-center text-gray-400 border-b border-gray-800 py-3">
          <div className="col-span-1 text-center text-sm font-medium">#</div>
          <div className="col-span-6 text-sm font-medium pl-2">Tiêu đề</div>
          <div className="col-span-3 text-sm font-medium pl-2">Nghệ sĩ</div>
          <div className="col-span-1 text-right text-sm font-medium pr-2">
            Thời gian
          </div>
        </div>

        {/* Danh sách bài hát */}
        <div className="">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-12 gap-4 items-center py-3 group hover:bg-gray-900/50 transition-colors"
            >
              {/* Số thứ tự */}
              <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
                {index + 1}
              </div>

              {/* Tiêu đề bài hát */}
              <div className="col-span-6 flex items-center pl-2">
                <p className="text-white font-medium truncate">{track.name}</p>
              </div>

              {/* Nghệ sĩ */}
              <div className="col-span-3 text-gray-400 group-hover:text-white pl-2 truncate">
                {track.artists[0].name}
                {track.artists.length > 1 && `, ${getCredits(track.artists)}`}
              </div>

              {/* Thời gian */}
              <div className="col-span-1 text-right text-gray-400 group-hover:text-white pr-2">
                {formatDurationForEachSong(track.duration_ms)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default AlbumTracksList;
