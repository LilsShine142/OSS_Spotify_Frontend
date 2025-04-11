import { assets } from "@/assets/assets";

export default function MainContent({ children }) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-gray-800 p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <img
                src={assets.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-6">
        {children || (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold mb-2">
              Chào mừng đến với Spotify Admin
            </h3>
            <p className="text-gray-400">Dữ liệu sẽ render tại đây</p>
          </div>
        )}
      </div>
    </div>
  );
}
