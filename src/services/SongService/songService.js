import { axiosInstance } from "@/lib/axios/axios";


export const getTrackVideoById = async (songId, token) => {
    try {
        const response = await axiosInstance.get(`/spotify_app/songs/${songId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy playlists:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
}