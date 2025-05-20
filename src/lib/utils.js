import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const formatDurationFromHHMMSS = (timeStr) => {
  // Tách theo dấu ":"
  const parts = timeStr.split(":").map(Number);

  let totalSeconds = 0;

  if (parts.length === 3) {
    // HH:MM:SS
    totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    totalSeconds = parts[0] * 60 + parts[1];
  } else {
    // Không đúng định dạng
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};