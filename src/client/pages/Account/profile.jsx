import { assets } from "@/assets/assets";
import AccountHeader from "@/client/layouts/components/Account/AccountHeader";
import FooterMain from "@/client/layouts/components/Footer/FooterMain";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleUpdateUserInfo } from "@/services/userService";
import { getUserInfoFromAPI } from "@/services/userService"; // nếu nó có tồn tại trong service

// Định nghĩa schema validation với Zod
const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  day: z.string().refine((val) => {
    const day = parseInt(val);
    return !isNaN(day) && day >= 1 && day <= 31;
  }, "Ngày không hợp lệ").optional(),
  month: z.string().optional(),
  year: z.string().refine((val) => {
    const year = parseInt(val);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear();
  }, "Năm không hợp lệ").optional(),
  password: z.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt")
    .optional()
    .or(z.literal('')),
});

function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userStorage = localStorage.getItem("userData");
      if (userStorage) {
        try {
          const user = await getUserInfoFromAPI();
          console.log(user.user);
          

          setUserData(user.user)
          setValue("name", user.user.name);
          setValue("gender", user.user.gender);
  
          if (user.user.dob) {
            const dobDate = new Date(user.user.dob);
            setValue("day", String(dobDate.getDate()));
            setValue("month", String(dobDate.getMonth() + 1));
            setValue("year", String(dobDate.getFullYear()));
          }
  
          setValue("password", "");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        navigate("/login");
      }
    };
  
    fetchUserData();
  }, [navigate, setValue]);
  




  // Hàm xử lý khi form được submit
  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Xử lý dữ liệu ngày tháng năm để tạo dob theo định dạng ISO
      let dobString = null;
      if (data.day && data.month && data.year) {
        // Tạo chuỗi ISO format YYYY-MM-DD
        const day = data.day.padStart(2, '0');
        const month = String(data.month).padStart(2, '0');
        dobString = `${data.year}-${month}-${day}`;
      }
      
      // Tạo đối tượng dữ liệu để gửi đi
      const updateData = {
        name: data.name || undefined,
        gender: data.gender || undefined,
        dob: dobString || undefined,
        password: data.password || undefined,
      };
      
      console.log(updateData)
      // Lọc bỏ các trường undefined
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );
      
      // Gọi API cập nhật thông tin
      const result = await handleUpdateUserInfo(filteredData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Cập nhật thông tin thành công!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Cập nhật thông tin thất bại.' });
        
        // Chuyển hướng nếu cần
        if (result.redirect) {
          setTimeout(() => {
            navigate(result.redirect);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi khi cập nhật thông tin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#121212]">
      {/* Header */}
      <AccountHeader />

      {/* Main Content */}
      <div className="w-full h-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-[800px] bg-[#121212] py-10 p-2 space-y-4 text-white">
          <img
            className="w-12 h-12 bg-[#292929] rounded-full p-3 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate("/account")}
            src={assets.arrow_left}
            alt="Go back"
          />

          <h1 className="text-[40px] tracking-tighter font-bold py-5">
            Chỉnh sửa hồ sơ
          </h1>
          
          <div className="text-white">
            <label className="font-semibold" htmlFor="">
              ID người dùng
            </label>{" "}
            <br />
            <label htmlFor="">{userData?._id || "Đang tải..."}</label>
          </div>
          
          {/* Hiển thị thông báo nếu có */}
          {message && (
            <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message.text}
            </div>
          )}
          
          <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="name">
                Tên hiển thị
              </label>
              <input
                id="name"
                className="bg-[#121212] border border-white p-3 rounded-[3px]"
                type="text"
                placeholder="Nhập tên hiển thị của bạn"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="bg-[#121212] border border-white p-3 rounded-[3px]"
                type="text"
                disabled
                value={userData?.email || "email@example.com"}
              />
            </div>

            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="password">
                Mật khẩu mới
              </label>
              <input
                id="password"
                className="bg-[#121212] border border-white p-3 rounded-[3px]"
                type="password"
                placeholder="Để trống nếu không muốn đổi mật khẩu"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            
            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="gender">
                Giới tính
              </label>
              <select
                id="gender"
                className="bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                {...register("gender")}
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="">
                Ngày sinh
              </label>
              <div className="flex gap-4">
                {/* Ngày */}
                <div className="w-1/3">
                  <input
                    className="w-full bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                    type="text"
                    placeholder="Ngày"
                    {...register("day")}
                  />
                  {errors.day && (
                    <p className="text-red-500 text-sm">{errors.day.message}</p>
                  )}
                </div>

                {/* Tháng */}
                <div className="w-1/3">
                  <select 
                    className="w-full bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                    {...register("month")}
                  >
                    <option value="1">Tháng Một</option>
                    <option value="2">Tháng Hai</option>
                    <option value="3">Tháng Ba</option>
                    <option value="4">Tháng Tư</option>
                    <option value="5">Tháng Năm</option>
                    <option value="6">Tháng Sáu</option>
                    <option value="7">Tháng Bảy</option>
                    <option value="8">Tháng Tám</option>
                    <option value="9">Tháng Chín</option>
                    <option value="10">Tháng Mười</option>
                    <option value="11">Tháng Mười Một</option>
                    <option value="12">Tháng Mười Hai</option>
                  </select>
                  {errors.month && (
                    <p className="text-red-500 text-sm">{errors.month.message}</p>
                  )}
                </div>

                {/* Năm */}
                <div className="w-1/3">
                  <input
                    className="w-full bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                    type="text"
                    placeholder="Năm"
                    {...register("year")}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm">{errors.year.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col text-white gap-2">
              <label className="font-semibold" htmlFor="country">
                Quốc gia hoặc khu vực
              </label>
              <select
                id="country"
                className="bg-[#121212] border border-white p-3 rounded-[3px] text-white"
              >
                <option value="vn">Việt Nam</option>
              </select>
            </div>

            {/* <div className="flex items-center text-white gap-2">
              <input
                id="shareData"
                className="w-4 h-4 border border-gray-400 hover:ring-2 hover:ring-green-500"
                type="checkbox"
                {...register("shareData")}
              />
              <label className="font-semibold text-sm" htmlFor="shareData">
                Chia sẻ dữ liệu đăng ký của tôi với các nhà cung cấp nội dung
                Spotify cho mục đích tiếp thị.
              </label>
            </div> */}
            
            <div className="w-full h-auto flex items-center justify-end gap-10 text-white font-semibold">
              <label 
                htmlFor="" 
                className="cursor-pointer hover:text-gray-300"
                onClick={() => navigate("/account")}
              >
                Hủy
              </label>
              <button 
                type="submit"
                disabled={isLoading}
                className="border border-white bg-green-500 text-black rounded-full px-5 hover:px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Lưu hồ sơ'}
              </button>
            </div>
            
            <div className="flex justify-center">
              <label className="text-[10px]" htmlFor="">
                Trang web này được bảo vệ bằng reCAPTCHA và tuân theo Chính sách
                quyền riêng tư cũng như Điều khoản dịch vụ của Google.
              </label>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full">
        <FooterMain />
      </div>
    </div>
  );
}

export default Profile;