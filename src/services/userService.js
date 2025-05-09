import axios from "axios"

export const handleUpdateUserInfo = async (data) => {
    try {
        // Lấy thông tin user từ localStorage
        const userStorage = localStorage.getItem("user");
        const user = userStorage ? JSON.parse(userStorage) : null;
        
        if (!user || !user.access_token) {
            return { success: false, message: "Vui lòng đăng nhập để tiếp tục." };
        }
        
        // Chuẩn bị dữ liệu để gửi đi
        // Chỉ gửi các trường có giá trị
        const updateData = {};
        
        // Kiểm tra và thêm các trường vào dữ liệu cập nhật
        if (data.name) updateData.name = data.name;
        if (data.dob) updateData.dob = data.dob;
        if (data.gender) updateData.gender = data.gender;
        if (data.password) updateData.password = data.password;
        if (data.profile_pic) updateData.profile_pic = data.profile_pic;
        
        console.log("Trong userService")
        console.log(updateData)
        // console.log(user.access_token)


        console.log(user.id)
        const url =  `http://127.0.0.1:8000/user_management/update_user/${user.id}/`
          
        
        // Gửi request cập nhật
        const response = await axios.put(
            url, 
            updateData,
            {
                headers: {
                    "Authorization": `Bearer ${user.access_token}`,
                    "Content-Type" : "application/json"
                }
            }
        );
        
        if (response.data.success) {
            return { 
                success: true, 
                message: "Cập nhật thông tin thành công!",
                user: response.data.data
            };
        } else {
            return { 
                success: false, 
                message: response.data.error || "Có lỗi xảy ra khi cập nhật thông tin." 
            };
        }
    } catch (error) {
        // Xử lý các lỗi HTTP khác nhau
        if (error.response) {
            // Máy chủ trả về lỗi có status code khác 2xx
            const errorMessage = error.response.data.error || "Có lỗi xảy ra khi cập nhật thông tin.";
            
            // Nếu token hết hạn (401)
            if (error.response.status === 401) {
                localStorage.removeItem("user"); // Xóa thông tin đăng nhập
                return { 
                    success: false, 
                    message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
                    redirect: "/login"
                };
            }
            // Nếu không có quyền (403)
            if (error.response.status === 403) {
                return { 
                    success: false, 
                    message: "Bạn không có quyền thực hiện thao tác này." 
                };
            }
            
            return { success: false, message: errorMessage };
        } else if (error.request) {
            // Request được gửi nhưng không nhận được response
            return { 
                success: false, 
                message: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau." 
            };
        } else {
            // Lỗi khi thiết lập request
            return { 
                success: false, 
                message: "Có lỗi xảy ra. Vui lòng thử lại." 
            };
        }
    }
};


export const getUserInfoFromAPI = async () => {
    try {
        
        const userStorage = localStorage.getItem("user");
        const user = userStorage ? JSON.parse(userStorage) : null;
       
        const url = `http://127.0.0.1:8000/user_management/get_user_info/${user.id}/`;

        // Gửi yêu cầu GET để lấy thông tin người dùng
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${user.access_token}`,
                "Content-Type": "application/json"
            }
        });

        // Kiểm tra phản hồi từ server
        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.error || "Không thể lấy thông tin người dùng." };
        }
    } catch (error) {
        // Xử lý lỗi trong quá trình gửi yêu cầu
        if (error.response) {
            const errorMessage = error.response.data.error || "Có lỗi xảy ra khi lấy thông tin người dùng.";

            // Kiểm tra mã lỗi
            if (error.response.status === 401) {
                localStorage.removeItem("user"); // Xóa thông tin người dùng nếu token hết hạn
                return { success: false, message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
            }

            return { success: false, message: errorMessage };
        } else {
            return { success: false, message: "Có lỗi xảy ra. Vui lòng thử lại." };
        }
    }
};