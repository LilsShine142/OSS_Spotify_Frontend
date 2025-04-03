import api from "./api";

export const getAllAccounts = async () => {
    try {
        const response = await api.get("/api/app/accounts/");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
        throw error;
    }
};
