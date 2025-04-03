import React from "react";

const buttonStyles = {
  primary: "bg-white text-black hover:bg-gray-300", // Nút được chọn (Tất cả)
  secondary: "bg-gray-800 border border-gray-600 text-white hover:bg-gray-900", // Nút chưa chọn
};

const CustomButton = ({ variant = "primary", children, onClick }) => {
  return (
    <button
      className={`text-sm font-bold px-4 py-1 rounded-full transition ${buttonStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;
