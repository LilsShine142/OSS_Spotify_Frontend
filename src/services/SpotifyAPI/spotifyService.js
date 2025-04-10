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