import { axiosInstance } from "../../lib/axios/axios";

export const fetchNewReleases = async () => {
    try {
        const response = await axiosInstance.get("/spotify_api/new-releases/");
        return response.data;
    } catch (error) {
        console.error("Error fetching new releases:", error);
        throw error;
    }
}

export const fetchTopArtists = async () => {
    try {
        const response = await axiosInstance.get("/spotify_api/top-artists/");
        return response.data;
    } catch (error) {
        console.error("Error fetching top artists:", error);
        throw error;
    }
}

export const fetchAlbumDataByID = async (albumId, accessToken) => {
    try {
        const response = await axiosInstance.get(
            `https://api.spotify.com/v1/albums/${albumId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching album data:", error);
        throw error;
    }
};

export const fetchAlbumTracksList = async (albumId, params, accessToken) => {
    try {
        // Truyền params trực tiếp vào URL của axios
        const response = await axiosInstance.get(
            `https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            params: params, // Truyền params vào `params` của axios
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching album tracks list:", error);
        throw error;
    }
};


export const fetchArtistInfo = async (artistId, accessToken) => {
    try {
        const response = await axiosInstance.get(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching artist info:", error);
        throw error;
    }
}