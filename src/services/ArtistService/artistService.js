import { axiosInstance } from "../../lib/axios/axios";

export const getArtistById = async (artistId, token) => {
    try {
        const response = await axiosInstance.get(`/spotify_app/artists/${artistId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching artist by ID:", error);
        throw error;
    }
}


const getArtistList = async (page, limit) => {
    try {
        const response = await axiosInstance.get(`/artist/?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching artist list:", error);
        throw error;
    }
}


export const updateArtist = async (data, token) => {
    try {
        const response = await axiosInstance.put(`/spotify_app/artists/${data._id}/update`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating artist:", error);
        throw error;
    }
}


export const createArtist = async (data, token) => {
    try {
        const response = await axiosInstance.post(`/spotify_app/artists/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating artist:", error);
        throw error;
    }
}


// Theo dõi nghệ sĩ/user
export const followTarget = async (follower_id, target_id, targetType, token) => {
    try {
        const response = await axiosInstance.post(
            '/spotify_app/follow/',
            {
                follower_id: follower_id,
                target_id: target_id, // ID của nghệ sĩ hoặc người dùng
                target_type: targetType // 'artist' hoặc 'user'
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error following target:", error);
        throw error;
    }
};

// Lấy danh sách nghệ sĩ đã theo dõi
export const getFollowedArtists = async (userId, token) => {
    try {
        const response = await axiosInstance.get(
            `/spotify_app/follow/${userId}/artists/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting followed artists:", error);
        throw error;
    }
};
