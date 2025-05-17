import React from "react";

const LoadingSpinner = ({ size = "md", color = "white" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    white: "border-white",
    primary: "border-blue-500",
    dark: "border-gray-800",
  };

  return (
    <div
      className={`inline-block ${sizeClasses[size]} animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4 ${colorClasses[color]} border-r-transparent`}
    ></div>
  );
};

export default LoadingSpinner;
