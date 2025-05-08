import React from "react";

const RenderIcon = ({
  icon: Icon, // Thay vì nhận iconName, nhận vào một component icon
  iconName,
  altText,
  className = "",
  isPlayPause = false,
}) => {
  return (
    <>
      {Icon ? (
        // Nếu có Icon (component từ react-icons), render nó
        <Icon
          className={`
            cursor-pointer
            hover:scale-110 
            transition-transform 
            duration-200 
            text-gray-500
            ${className}
          `}
        />
      ) : (
        // Nếu không có Icon, hiển thị img
        <img
          src={iconName} // altText giờ sẽ là đường dẫn ảnh
          alt={altText}
          className={`
            cursor-pointer
            ${
              isPlayPause
                ? "brightness-0"
                : "brightness-50 hover:brightness-100"
            }
            hover:scale-110 
            transition-transform 
            duration-200 
            ${className}
          `}
        />
      )}
    </>
  );
};

export { RenderIcon };
