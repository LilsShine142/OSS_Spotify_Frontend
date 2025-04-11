import React, { useState, useEffect } from "react";

const FilterSort = ({ songs, setFilteredSongs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    let filtered = songs.filter((song) => {
      const keyword = searchTerm.toLowerCase();
      return (
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword) ||
        song.album.toLowerCase().includes(keyword)
      );
    });

    if (sortBy) {
      filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    setFilteredSongs(filtered);
  }, [searchTerm, sortBy, songs, setFilteredSongs]);

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Lọc theo tên, nghệ sĩ, album..."
        value={searchTerm}
        onChange={handleSearch}
        className="bg-gray-800 text-white px-4 py-2 rounded-md w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Dropdown sắp xếp */}
      <div>
        <label htmlFor="sort" className="mr-2 font-medium">Sắp xếp theo:</label>
        <select
          id="sort"
          className="bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={handleSort}
          value={sortBy}
        >
          <option value="">-- Chọn --</option>
          <option value="title">Tiêu đề</option>
          <option value="artist">Nghệ sĩ</option>
          <option value="album">Album</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSort;
