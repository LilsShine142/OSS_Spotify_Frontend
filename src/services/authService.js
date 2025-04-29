import Cookies from "js-cookie";
import { axiosInstance } from "../lib/axios/axios";

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

            return response.data;
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
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
