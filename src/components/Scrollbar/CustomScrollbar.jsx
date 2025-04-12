export default function CustomScrollbar({ children, className = "" }) {
  return (
    <div
      className={`group overflow-y-auto overflow-x-hidden scrollbar-w-3 scrollbar scrollbar-thumb-gray-700 scrollbar-track-transparent ${className}`}
    >
      {children}
    </div>
  );
}
