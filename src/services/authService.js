import Cookies from "js-cookie";
import { axiosInstance } from "../lib/axios/axios";
import axios from "axios";
import { toast } from "sonner";

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post(
            "/user_management/login/",
            { email, password },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.data && response.data.access_token) {
            Cookies.set("access_token", response.data.access_token, { expires: 7 });

            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${response.data.access_token}`;

            return response.data;
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};



export const handleLogin = async (data) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/user_management/login/", {
            email: data.email,
            password: data.password,
        });

        if (response.data.success) {
            const user = {
                id: response.data._id,
                role: response.data.role,
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
            };
            localStorage.setItem("user", JSON.stringify(user));
            return { success: true, user };
        } else if (response.data.success == false) {
            return { success: false, message: "Email hoặc mật khẩu không chính xác." };

        } else {
            return { success: false, redirect: "/register", message: "Không tìm thấy người dùng" };
        }
    } catch (error) {
        // return { success: false, message: "Lỗi kết nối máy chủ. Vui lòng thử lại." };
        return { success: false, message: "Email hoặc mật khẩu không chính xác." };

    }
};


// export const handleRegister = async (data) => {
//     try {
//         // Tạo FormData để có thể gửi file
//         const formData = new FormData();

//         // Thêm các trường cơ bản
//         formData.append('email', data.email);
//         formData.append('password', data.password);
//         formData.append('name', data.name);
//         formData.append('dob', data.dob);
//         formData.append('gender', data.gender);

//         // Thêm các trường không bắt buộc nếu có
//         if (data.role) formData.append('role', data.role);
//         if (data.avatar) formData.append('profile_pic', data.profile_pic);

//         // Cấu hình header cho multipart/form-data
//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         };

//         const response = await axiosInstance.post(
//             `/user_management/register/`,
//             formData,
//             config
//         );

//         if (response.status === 201) {
//             return {
//                 message: "success",
//                 data: response.data
//             };
//         } else {
//             return {
//                 message: "error",
//                 error: response.data?.detail || 'Unknown error'
//             };
//         }
//     } catch (error) {
//         console.error('Registration error:', error);

//         // Xử lý các loại lỗi khác nhau
//         if (error.response) {
//             // Lỗi từ phía server
//             const serverError = error.response.data;

//             if (error.response.status === 400) {
//                 if (serverError.email) {
//                     return { message: "email_exists", error: serverError.email };
//                 }
//                 return {
//                     message: "validation_error",
//                     errors: serverError
//                 };
//             }

//             return {
//                 message: "server_error",
//                 error: serverError.detail || 'Server error'
//             };
//         } else if (error.request) {
//             // Lỗi không có phản hồi từ server
//             return { message: "network_error", error: 'Không thể kết nối đến server' };
//         } else {
//             // Lỗi khác
//             return { message: "unknown_error", error: error.message };
//         }
//     }
// };
export const handleRegister = async (data) => {
    try {
        // Tạo payload với tất cả các trường cần thiết
        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            dob: data.dob,
            gender: data.gender,
            role: data.role || 'user', // Mặc định là 'user' nếu không có
            profile_pic: data.profile_pic || null // Thêm trường profile_pic
        };

        const response = await axios.post(
            'http://127.0.0.1:8000/user_management/register/',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 201) {
            return { message: "success", data: response.data };
        }

        return { message: "error", error: response.data?.error || 'Unknown error' };

    } catch (error) {
        console.error('Registration error:', error);

        if (error.response) {
            // Xử lý lỗi từ server
            if (error.response.status === 400) {
                return {
                    message: "validation_error",
                    errors: error.response.data
                };
            }
            return {
                message: "server_error",
                error: error.response.data?.error || error.response.data?.detail || 'Server error'
            };
        } else if (error.request) {
            return { message: "network_error", error: 'Không thể kết nối đến server' };
        } else {
            return { message: "unknown_error", error: error.message };
        }
    }
};




export const logout = () => {
    Cookies.remove("authToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
};

export const getCurrentUser = () => {
    const token = Cookies.get("authToken");
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return { token };
    }
    return null;
};

export const checkAuthToken = () => {
    const token = Cookies.get("authToken");
    return !!token;
};


