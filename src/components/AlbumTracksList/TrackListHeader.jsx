import React from "react";

const TrackListHeader = ({ columns }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center text-gray-400 border-b border-gray-800 py-1">
      {columns.map((col, index) => (
        <div
          key={index}
          className={`col-span-${col.span} text-${
            col.align
          } text-sm font-medium ${col.pl ? `pl-${col.pl}` : ""} ${
            col.pr ? `pr-${col.pr}` : ""
          }`}
        >
          {col.label}
        </div>
      ))}
    </div>
  );
};

export default TrackListHeader;
