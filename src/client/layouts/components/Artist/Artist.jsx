// import React, { useState, useEffect, useContext } from "react";
// import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
// import { assets } from "../../../../assets/assets";
// import { useParams } from "react-router-dom";
// import FooterMain from "../Footer/FooterMain";
// import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
// import { getArtistById } from "../../../../services/ArtistService/artistService";
// import { RenderIcon } from "@/components/Button/RenderIcon";
// import { CiSaveDown1 } from "react-icons/ci";
// import { HiDotsHorizontal } from "react-icons/hi";
// import toast from "react-hot-toast";
// import PlayButton from "@/components/Button/PlayButton";
// import TrackListHeader from "../../../../components/AlbumTracksList/TrackListHeader";
// import TrackItem from "../../../../components/AlbumTracksList/TrackItem";
// import { Trackcolumns } from "@/lib/constaints/constants";

// const Artist = () => {
//   const { id: artistId } = useParams();
//   const [artistData, setArtistData] = useState(null);
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);
//   const [selectedSong, setSelectedSong] = useState(null);
//   const [hoveredTrackId, setHoveredTrackId] = useState(null);
//   const { playerState, play, pause, resume } = useContext(PlayerContext);

//   useEffect(() => {
//     const fetchArtist = async () => {
//       try {
//         const tokenData = JSON.parse(localStorage.getItem("userData"));
//         if (!tokenData) {
//           toast.error("Vui lòng đăng nhập để xem thông tin nghệ sĩ!");
//           return;
//         }
//         console.log("tokenData", tokenData);
//         console.log("artistId", artistId);
//         setLoading(true);
//         const response = await getArtistById(artistId, tokenData.token);
//         console.log("response artist", response);
//         setArtistData(response);
//         // setSongs(response.data.songs);
//       } catch (error) {
//         console.error("Error fetching artist:", error);
//         toast.error("Không thể tải thông tin nghệ sĩ!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchArtist();
//   }, [artistId]);
//   console.log("artistData", artistData);
//   const artistName =
//     artistData?.artist_name ||
//     songs?.[0]?.artist_name ||
//     songs?.[0]?.artist ||
//     "Unknown";
//   const description =
//     artistData?.description ||
//     `With his melodic songs and inspirational lyrics, ${artistName} captivated audiences worldwide.`;
//   const profile_img = artistData?.profile_img || assets.Avicii_banner;

//   const handlePlayTrack = (track, currentTrackindex) => {
//     if (playerState.currentTrack?._id === track._id) {
//       playerState.isPlaying ? pause() : resume();
//     } else {
//       play(
//         {
//           _id: track._id,
//           title: track.title,
//           artist: track.artist_name || track.artist || "Nghệ sĩ",
//           img: track.img || assets.avatar,
//           audioUrl: track.audio_file,
//           duration: track.duration,
//         },
//         currentTrackindex
//       );
//     }
//   };

//   const isTrackPlaying = (trackId) => {
//     return playerState.currentTrack?._id === trackId && playerState.isPlaying;
//   };

//   const openDownloadModal = (song) => {
//     if (song) {
//       setSelectedSong(song);
//       setShowDownloadModal(true);
//     } else {
//       toast.error("Không tìm thấy bài hát!");
//     }
//   };

//   const handleDownload = async () => {
//     if (!selectedSong || !selectedSong.audio_file) {
//       toast.error("Không tìm thấy file audio để tải!");
//       setShowDownloadModal(false);
//       return;
//     }

//     try {
//       toast.loading("Đang tải file...", { id: selectedSong._id });
//       const response = await fetch(selectedSong.audio_file, { method: "GET" });
//       if (!response.ok) throw new Error("Không thể tải file audio");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${selectedSong.title}.mp3`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success("Tải file thành công!", { id: selectedSong._id });
//     } catch (error) {
//       toast.error(`Tải file thất bại: ${error.message}`, {
//         id: selectedSong._id,
//       });
//     } finally {
//       setShowDownloadModal(false);
//       setSelectedSong(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <CustomScrollbar className="w-full h-[80vh] rounded-lg bg-gradient-to-b from-zinc-800 to-black text-white">
//       {/* Header nghệ sĩ */}
//       <div className="relative h-[300px] w-full">
//         <img
//           src={profile_img}
//           alt="Artist"
//           className="w-full h-full object-cover rounded-t-lg"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
//         <div className="absolute bottom-6 left-6 flex flex-col gap-2">
//           <div className="flex items-center gap-2">
//             <svg
//               className="w-5 h-5 text-blue-400"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span className="text-sm text-gray-300">Nghệ sĩ được xác minh</span>
//           </div>
//           <h1 className="text-5xl md:text-6xl font-bold">{artistName}</h1>
//         </div>
//       </div>

//       {/* Nội dung chính */}
//       <div className="p-6">
//         {/* Player Controls */}
//         <div className="flex items-center gap-4 py-4">
//           {/* <PlayButton
//             isActive={true}
//             size="large"
//             isPlaying={playerState.isPlaying}
//             onTogglePlay={() => {
//               if (songs[0]) {
//                 handlePlayTrack(songs[0], 0);
//               }
//             }}
//           /> */}
//           <button className="hover:scale-110 transition-transform">
//             <RenderIcon
//               iconName={assets.shuffle_icon}
//               altText="Xáo trộn"
//               className="w-6 h-6 text-gray-300 hover:text-white"
//             />
//           </button>
//           <button className="hover:scale-110 transition-transform">
//             <RenderIcon
//               iconName={assets.plus_icon}
//               altText="Thêm"
//               className="w-6 h-6 text-gray-300 hover:text-white"
//             />
//           </button>
//           <button
//             className="hover:scale-110 transition-transform"
//             onClick={() => openDownloadModal(songs[0])}
//           >
//             <RenderIcon
//               icon={CiSaveDown1}
//               altText="Tải xuống"
//               className="w-8 h-8 text-gray-300 hover:text-white"
//             />
//           </button>
//           <button className="hover:scale-110 transition-transform">
//             <RenderIcon
//               icon={HiDotsHorizontal}
//               altText="Thêm tùy chọn"
//               className="w-8 h-8 text-gray-300 hover:text-white"
//             />
//           </button>
//         </div>

//         {/* BẢNG DANH SÁCH BÀI HÁT */}
//         <div className="mt-6">
//           <h2 className="text-2xl font-bold mb-4">Phổ biến</h2>
//           <div className="px-6">
//             <TrackListHeader columns={Trackcolumns} />
//             <div>
//               {songs.map((track, index) => (
//                 <TrackItem
//                   key={track._id}
//                   track={track}
//                   index={index}
//                   isPlaying={playerState.isPlaying}
//                   isCurrentTrack={isTrackPlaying(track._id)}
//                   onPlayTrack={() => handlePlayTrack(track, index)}
//                   onMouseEnter={() => setHoveredTrackId(track._id)}
//                   onMouseLeave={() => setHoveredTrackId(null)}
//                   hoveredTrackId={hoveredTrackId}
//                   onDownload={() => openDownloadModal(track)}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Phần giới thiệu */}
//         <div className="mt-8">
//           <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
//           <div className="flex flex-col md:flex-row gap-6">
//             <img
//               className="w-full md:w-1/2 h-[300px] object-cover rounded-lg"
//               src={profile_img}
//               alt={artistName}
//             />
//             <div className="flex-1">
//               <p className="text-gray-300 mb-4">
//                 {/* {artistData?.monthlyListeners || "37,428,840"} người nghe hằng
//                 tháng */}
//                 {artistData?.biography}
//               </p>
//               <p className="text-gray-300 line-clamp-4">{description}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal xác nhận tải */}
//       {showDownloadModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
//             <h2 className="text-lg font-bold text-white mb-4">
//               Xác nhận tải xuống
//             </h2>
//             <p className="text-gray-300 mb-6">
//               Bạn có muốn tải bài hát "{selectedSong?.title}" không?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowDownloadModal(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={handleDownload}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Tải xuống
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <FooterMain />
//     </CustomScrollbar>
//   );
// };

// export default Artist;
import React, { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../../../../context/PlayerContext/PlayerContext";
import { assets } from "../../../../assets/assets";
import { useParams } from "react-router-dom";
import FooterMain from "../Footer/FooterMain";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";
import {
  getArtistById,
  followTarget,
  getFollowedArtists,
} from "../../../../services/ArtistService/artistService";
import { RenderIcon } from "@/components/Button/RenderIcon";
import { CiSaveDown1 } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import PlayButton from "@/components/Button/PlayButton";
import TrackListHeader from "../../../../components/AlbumTracksList/TrackListHeader";
import TrackItem from "../../../../components/AlbumTracksList/TrackItem";
import { Trackcolumns } from "@/lib/constaints/constants";

const Artist = () => {
  const { id: artistId } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { playerState, play, pause, resume } = useContext(PlayerContext);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("userData"));
        if (!tokenData) {
          toast.error("Vui lòng đăng nhập để xem thông tin nghệ sĩ!");
          return;
        }

        setLoading(true);

        // Lấy thông tin nghệ sĩ
        const artistResponse = await getArtistById(artistId, tokenData.token);
        setArtistData(artistResponse);

        // Lấy danh sách bài hát của nghệ sĩ (giả định API trả về trong artistResponse)
        if (artistResponse.songs) {
          setSongs(artistResponse.songs);
        }

        // Kiểm tra trạng thái follow
        const followedArtists = await getFollowedArtists(
          tokenData.user?.data._id,
          tokenData.token
        );
        console.log("followedArtists", followedArtists);  
        const isFollowed = followedArtists.some(
          (artist) => artist.id === artistId
        );
        setIsFollowing(isFollowed);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        toast.error("Không thể tải thông tin nghệ sĩ!");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  const handleFollowArtist = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("userData"));
      if (!tokenData) {
        toast.error("Vui lòng đăng nhập để theo dõi nghệ sĩ!");
        return;
      }

      setFollowLoading(true);
      console.log("tokenData", tokenData);
      // Gọi API follow/unfollow
      await followTarget(
        tokenData.user?.data._id,
        artistId,
        "artist", // Loại target là artist
        tokenData.token
      );

      // Đảo ngược trạng thái follow
      setIsFollowing(!isFollowing);
      toast.success(
        isFollowing ? "Đã bỏ theo dõi nghệ sĩ" : "Đã theo dõi nghệ sĩ"
      );
    } catch (error) {
      console.error("Error following artist:", error);
      toast.error(
        `Không thể ${isFollowing ? "bỏ theo dõi" : "theo dõi"} nghệ sĩ`
      );
    } finally {
      setFollowLoading(false);
    }
  };

  const artistName =
    artistData?.artist_name ||
    songs?.[0]?.artist_name ||
    songs?.[0]?.artist ||
    "Unknown";
  const description =
    artistData?.description ||
    `Với những bài hát đầy cảm xúc, ${artistName} đã chinh phục trái tim người nghe trên toàn thế giới.`;
  const profile_img = artistData?.profile_img || assets.Avicii_banner;

  const handlePlayTrack = (track, currentTrackindex) => {
    if (playerState.currentTrack?._id === track._id) {
      playerState.isPlaying ? pause() : resume();
    } else {
      play(
        {
          _id: track._id,
          title: track.title,
          artist: track.artist_name || track.artist || "Nghệ sĩ",
          img: track.img || assets.avatar,
          audioUrl: track.audio_file,
          duration: track.duration,
        },
        currentTrackindex
      );
    }
  };

  const isTrackPlaying = (trackId) => {
    return playerState.currentTrack?._id === trackId && playerState.isPlaying;
  };

  const openDownloadModal = (song) => {
    if (song) {
      setSelectedSong(song);
      setShowDownloadModal(true);
    } else {
      toast.error("Không tìm thấy bài hát!");
    }
  };

  const handleDownload = async () => {
    if (!selectedSong || !selectedSong.audio_file) {
      toast.error("Không tìm thấy file audio để tải!");
      setShowDownloadModal(false);
      return;
    }

    try {
      toast.loading("Đang tải file...", { id: selectedSong._id });
      const response = await fetch(selectedSong.audio_file, { method: "GET" });
      if (!response.ok) throw new Error("Không thể tải file audio");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedSong.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tải file thành công!", { id: selectedSong._id });
    } catch (error) {
      toast.error(`Tải file thất bại: ${error.message}`, {
        id: selectedSong._id,
      });
    } finally {
      setShowDownloadModal(false);
      setSelectedSong(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <CustomScrollbar className="w-full h-[80vh] rounded-lg bg-gradient-to-b from-zinc-800 to-black text-white">
      {/* Header nghệ sĩ */}
      <div className="relative h-[300px] w-full">
        <img
          src={profile_img}
          alt="Artist"
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-300">Nghệ sĩ được xác minh</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">{artistName}</h1>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="p-6">
        {/* Player Controls */}
        <div className="flex items-center gap-4 py-4">
          <PlayButton
            isActive={true}
            size="large"
            isPlaying={playerState.isPlaying}
            onTogglePlay={() => {
              if (songs[0]) {
                handlePlayTrack(songs[0], 0);
              }
            }}
          />
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              iconName={assets.shuffle_icon}
              altText="Xáo trộn"
              className="w-6 h-6 text-gray-300 hover:text-white"
            />
          </button>

          {/* Nút theo dõi */}
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isFollowing
                ? "bg-gray-600 text-white"
                : "bg-transparent border border-gray-300 text-gray-300 hover:border-white hover:text-white"
            }`}
            onClick={handleFollowArtist}
            disabled={followLoading}
          >
            {followLoading ? (
              <span>Đang xử lý...</span>
            ) : isFollowing ? (
              <>
                <FaCheck className="w-4 h-4" />
                <span>Đã theo dõi</span>
              </>
            ) : (
              <>
                <RenderIcon
                  iconName={assets.plus_icon}
                  altText="Theo dõi"
                  className="w-4 h-4"
                />
                <span>Theo dõi</span>
              </>
            )}
          </button>

          <button
            className="hover:scale-110 transition-transform"
            onClick={() => openDownloadModal(songs[0])}
          >
            <RenderIcon
              icon={CiSaveDown1}
              altText="Tải xuống"
              className="w-8 h-8 text-gray-300 hover:text-white"
            />
          </button>
          <button className="hover:scale-110 transition-transform">
            <RenderIcon
              icon={HiDotsHorizontal}
              altText="Thêm tùy chọn"
              className="w-8 h-8 text-gray-300 hover:text-white"
            />
          </button>
        </div>

        {/* BẢNG DANH SÁCH BÀI HÁT */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Phổ biến</h2>
          <div className="px-6">
            <TrackListHeader columns={Trackcolumns} />
            <div>
              {songs.map((track, index) => (
                <TrackItem
                  key={track._id}
                  track={track}
                  index={index}
                  isPlaying={playerState.isPlaying}
                  isCurrentTrack={isTrackPlaying(track._id)}
                  onPlayTrack={() => handlePlayTrack(track, index)}
                  onMouseEnter={() => setHoveredTrackId(track._id)}
                  onMouseLeave={() => setHoveredTrackId(null)}
                  hoveredTrackId={hoveredTrackId}
                  onDownload={() => openDownloadModal(track)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phần giới thiệu */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              className="w-full md:w-1/2 h-[300px] object-cover rounded-lg"
              src={profile_img}
              alt={artistName}
            />
            <div className="flex-1">
              <p className="text-gray-300 mb-4">{artistData?.biography}</p>
              <p className="text-gray-300 line-clamp-4">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận tải */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-white mb-4">
              Xác nhận tải xuống
            </h2>
            <p className="text-gray-300 mb-6">
              Bạn có muốn tải bài hát "{selectedSong?.title}" không?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterMain />
    </CustomScrollbar>
  );
};

export default Artist;
