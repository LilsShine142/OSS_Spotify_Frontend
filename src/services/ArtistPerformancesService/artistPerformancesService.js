
import { axiosInstance } from '../../lib/axios/axios';

export const getArtistPerformancesSong = async (songId, token) => {
    try {
        const response = await axiosInstance.get(`/music_library/artistperform/song/${songId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response.data", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy performances:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
}