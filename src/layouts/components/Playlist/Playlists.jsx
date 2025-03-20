import React from "react";
import { assets } from "../../../assets/assets";

const playlists = [
  {
    id: 1,
    name: "Bài hát đã thích",
    description: "Danh sách phát • 1 bài hát",
    image: assets.avatar,
  },
  {
    id: 2,
    name: "My top tracks playlist",
    description: "Danh sách phát • Phạm Thanh Sự",
    image: assets.avatar,
  },
  {
    id: 3,
    name: "Daily Mix 3",
    description: "Danh sách phát • Phạm Thanh Sự",
    image: assets.avatar,
  },
  {
    id: 4,
    name: "New Folder",
    description: "0 danh sách phát",
    image: assets.avatar,
  },
  {
    id: 5,
    name: "My Playlist #11",
    description: "Danh sách phát • Phạm Thanh Sự",
    image: assets.avatar,
  },
  {
    id: 6,
    name: "ATSH",
    description: "Danh sách phát • Phạm Thanh Sự",
    image: assets.avatar,
  },
];

const artists = [
  {
    id: 1,
    name: "AMEE",
    description: "Nghệ sĩ",
    image: assets.avatar,
  },
  {
    id: 2,
    name: "Obito",
    description: "Nghệ sĩ",
    image: assets.avatar,
  },
  {
    id: 3,
    name: "Đạt G",
    description: "Nghệ sĩ",
    image: assets.avatar,
  },
  {
    id: 4,
    name: "Masew",
    description: "Nghệ sĩ",
    image: assets.avatar,
  },
];

const PlaylistItem = ({ item, width }) => {
  return (
    <div className="flex items-center pr-1 mr-1 w-full gap-3 px-3 py-2 hover:bg-[#242424] rounded-lg cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-md"
      />
      {width > 86 && (
        <div>
          <p className="text-white font-semibold">{item.name}</p>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
      )}
    </div>
  );
};

const Playlists = ({ width }) => {
  return (
    <div className={`container mx-auto w-full ${width > 86 ? 'max-h-[67%]' : 'max-h-[87%]'} overflow-y-auto pr-2 scrollbar-custom scrollbar-hidden`}>
      {playlists.map((playlist) => (
        <PlaylistItem key={playlist.id} item={playlist} width={width} />
      ))}
      {artists.map((artist) => (
        <PlaylistItem key={artist.id} item={artist} width={width} />
      ))}
    </div>
  );
};

export default Playlists;
