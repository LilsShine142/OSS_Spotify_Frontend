import { axiosInstance } from "../../lib/axios/axios";

const getArtist = async (artistId) => {
    try {
        const response = await axiosInstance.get(`/artist/${artistId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching artist data:", error);
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