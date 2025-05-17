import Cookies from "js-cookie";
import { axiosInstance } from "../lib/axios/axios";
import axios from "axios";

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


