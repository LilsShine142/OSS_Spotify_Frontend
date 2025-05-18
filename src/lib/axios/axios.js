// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000",

// });
import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance chính
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    // withCredentials: true,
});

// // Hàm refresh token
// const refreshAccessToken = async () => {
//     console.log("Refreshing access token...");
//     try {
//         // Sử dụng axios thay vì axiosInstance để tránh interceptor lặp vô hạn
//         const response = await axiosInstance.post(
//             "/user_management/auth/token/refresh/",
//             {}, // Body rỗng
//             {
//                 withCredentials: true
//             }
//         );
//         console.log("response", response);

//         if (response.data?.access_token) {
//             Cookies.set("access_token", response.data.access_token);
//             axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
//             return response.data.access_token;
//         }
//         throw new Error("No access token in response");
//     } catch (error) {
//         console.error("Refresh error details:", {
//             config: error.config,
//             response: error.response?.data
//         });
//         Cookies.remove("access_token");
//         throw error;
//     }
// };
// // Thêm interceptor cho request để tự động gắn token
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get("access_token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Thêm interceptor cho response để xử lý token hết hạn
// axiosInstance.interceptors.response.use(
//     (response) => {
//         // Xử lý response thành công
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         // Kiểm tra đầy đủ điều kiện trước khi refresh
//         const shouldRefreshToken = (
//             error.response?.status === 401 &&
//             !originalRequest._retry &&
//             !isRefreshTokenRequest(originalRequest)
//         );

//         if (shouldRefreshToken) {
//             originalRequest._retry = true;
//             console.log("Token expired, attempting refresh...");

//             try {
//                 const newToken = await refreshAccessToken();
//                 console.log("New token:", newToken);
//                 // Cập nhật header và gửi lại request gốc
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 console.error("Refresh token failed:", refreshError);
//                 // Xử lý khi refresh thất bại (ví dụ: đăng xuất)
//                 handleRefreshTokenFailure();
//                 return Promise.reject(refreshError);
//             }
//         }
//         console.log("Đã bỏ qua refresh token");

//         return Promise.reject(error);
//     }


// );
// // Hàm helper kiểm tra request refresh token
// function isRefreshTokenRequest(config) {
//     // Kiểm tra cả URL tuyệt đối và tương đối
//     const fullUrl = config.baseURL
//         ? `${config.baseURL}${config.url}`
//         : config.url;
//     console.log("fullUrl", fullUrl);
//     return fullUrl.includes('/auth/token/refresh');
// }

// // Xử lý khi refresh token thất bại
// function handleRefreshTokenFailure() {
//     Cookies.remove("access_token");
//     // Redirect về login với state rõ ràng
//     // window.location.href = '/login?session_expired=1';
// }