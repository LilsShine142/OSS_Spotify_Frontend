import { axiosInstance } from "../../lib/axios/axios";

export const getTracksListByPlaylistId = async (playlistId, token) => {
    try {
        const response = await axiosInstance.get(`/spotify_app/playlists/${playlistId}/songs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("response", response);
        if (response.data) {
            return { success: true, Playlist: response.data };
        } else {
            return { success: false, message: response.data.error };
        }
    } catch (error) {
        console.error("Lỗi khi lấy playlists:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
}