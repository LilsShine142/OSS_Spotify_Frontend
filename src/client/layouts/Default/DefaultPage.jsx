import { Link } from "react-router-dom";

const DefaultPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-center">
      <div className="max-w-md w-full space-y-6 p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
        {/* Biểu tượng cảnh báo */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Nội dung */}
        <h1 className="text-4xl font-bold text-white">404 - Không tìm thấy</h1>
        <p className="text-lg text-gray-300">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Nút quay về */}
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 mt-6 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default DefaultPage;
