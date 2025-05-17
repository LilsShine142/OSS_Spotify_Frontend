import api from "../api";

export const getFavoriteSongsSummary = async (userId, token) => {
    try {
        const response = await api.get(`/music_library/favorite_songs/${userId}/favorite/songs/summary/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            return { success: true, favoriteSongs: response.data };
        } else {
            return { success: false, message: response.data.error };
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát yêu thích:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
};
