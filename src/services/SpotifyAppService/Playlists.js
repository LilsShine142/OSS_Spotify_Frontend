import api from "../api";

export const getAllsPlaylists = async (userId, token) => {
    try {
        const response = await api.get(`/spotify_app/playlists/getalls/${userId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            return { success: true, Playlists: response.data };
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


export const getPlaylistById = async (playlistId, token) => {
    try {
        const response = await api.get(`/spotify_app/playlists/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            return { success: true, Playlists: response.data };
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