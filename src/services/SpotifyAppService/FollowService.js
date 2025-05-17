import api from "../api";

export const getAllsArtistFollowed = async (userId, token) => {
    try {
        const response = await api.get(`/spotify_app/follow/${userId}/artists/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            return { success: true, artists: response.data };
        } else {
            return { success: false, message: response.data.error };
        }
    } catch (error) {
        console.error("Lỗi khi lấy artists:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
}


export const getAllsUserFollowed = async (userId, token) => {
    try {
        const response = await api.get(`/spotify_app/follow/${userId}/users/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            return { success: true, users: response.data };
        } else {
            return { success: false, message: response.data.error };
        }
    } catch (error) {
        console.error("Lỗi khi lấy users:", error);

        if (error.response?.status === 401) {
            return { success: false, message: "Phiên đăng nhập đã hết hạn", expired: true };
        }

        return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
    }
}