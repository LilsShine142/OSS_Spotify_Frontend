import axios from "axios";

// Upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cloudinary_OSSD");

  try {
    console.log("Uploading image with preset: cloudinary_OSSD");
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

    console.log("Cloudinary image response:", response.data);
    if (response.data.secure_url) {
      return response.data.secure_url;
    }
    throw new Error("Upload failed: No secure_url returned");
  } catch (error) {
    console.error("Cloudinary image upload error:", error.response?.data || error.message);
    throw error;
  }
};

// Upload file âm thanh hoặc video lên Cloudinary
export const uploadFileAudioToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cloud_OSSD_fileupload");
  formData.append("resource_type", "auto"); // Quan trọng: Cho phép Cloudinary nhận diện audio/video

  try {
    console.log("Uploading audio/video with preset: cloud_OSSD_fileupload");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/ddlso6ofq/auto/upload", // Endpoint đúng
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

    console.log("Cloudinary audio/video response:", response.data);
    if (response.data.secure_url) {
      return response.data.secure_url;
    }
    throw new Error("Upload failed: No secure_url returned");
  } catch (error) {
    console.error("Cloudinary audio/video upload error:", error.response?.data || error.message);
    throw error;
  }
};