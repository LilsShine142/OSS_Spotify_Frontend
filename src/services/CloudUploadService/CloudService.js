import { axiosInstance } from "../lib/axios/axios";
import axios from "axios";

// Upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cloud_htttdn");
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/ddlso6ofq/image/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            }
        );

        console.log("Cloudinary response:", response.data);
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

// Upload file nhạc lên Cloudinary
export const uploadFileAudioToCloudinary = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cloud_OSSD_fileupload");
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/ddlso6ofq/image/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            }
        );

        console.log("Cloudinary response:", response.data);
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};


