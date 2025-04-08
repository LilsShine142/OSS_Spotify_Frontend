import React from "react";

const RenderIcon = ({
  iconName,
  altText,
  className = "",
  isPlayPause = false,
}) => {
  return (
    <img
      src={iconName}
      alt={altText}
      className={`
        cursor-pointer
        ${isPlayPause ? "brightness-0" : "brightness-50 hover:brightness-100"}
        hover:scale-110 
        transition-transform 
        duration-200 
        ${className}
      `}
    />
  );
};

export { RenderIcon };
