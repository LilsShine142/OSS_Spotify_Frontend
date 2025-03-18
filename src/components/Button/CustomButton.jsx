import React from "react";

const buttonStyles = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-700 text-white hover:bg-gray-800",
  outline: "border border-gray-500 text-white hover:bg-gray-700",
};

const CustomButton = ({ variant = "primary", children, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md transition ${buttonStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;
