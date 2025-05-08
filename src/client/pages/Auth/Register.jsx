import { assets } from '@/assets/assets';
import React from 'react';
import axios from 'axios';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

const schema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 kí tự'),
    confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu'),
    name: z.string().min(6, 'Tên của bạn ít nhất 6 kí tự'),
    day: z.string().regex(/^\d{1,2}$/, 'Ngày không hợp lệ'),
    month: z.string().nonempty('Chọn tháng sinh'),
    year: z.string().regex(/^\d{4}$/, 'Năm không hợp lệ'),
    gender: z.string().nonempty({ message: 'Hãy chọn giới tính' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleRegister = async (data) => {
    const { email, password, name, day, month, year, gender } = data;
    // const date = `${day}-${month}-${year}`;
    const date = `${year}-${month}-${day}`;

    try {
      const response = await axios.post('http://127.0.0.1:8000/user_management/register/', {
        email,
        password,
        name,
        date,
        gender,
      });

      if (response.data.success) {
        toast.success('Đăng ký thành công!');
        window.location.href = '/login';
      } else if (response.data.error === 'User already exists') {
        toast.error('Tài khoản đã tồn tại!');
        window.location.href = '/login';
      } else {
        console.error('Lỗi đăng ký:', response.data.error);
        toast.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
        // if (password !== confirmpassword) {
        //     console.error("Passwords do not match!");
        //     alert("Passwords do not match. Please try again.");
        //     return;
        // }
        
        // if (!day || !month || !year || isNaN(new Date(dob).getTime())) {
        //     alert("Invalid date of birth. Please check your inputs.");
        //     return;
        // }
        // // Combine day, month, and year into a formatted date string
        // const monthIndex = new Date(`${month} 1`).getMonth() + 1; // Convert month name to index
        // const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex; // Add leading zero
        // const dob = `${year}-${formattedMonth}-${day.padStart(2, '0')}`; // Format: YYYY-MM-DD

        // const response = await axios.post("http://127.0.0.1:8000/user_management/register/", {
        //     email,
        //     password,
        //     name,
        //     gender,
        //     dob, // Pass the formatted dob
        // });

        // if (response.data.success) {
        //     alert("Registration successful! Redirecting to login...");
        //     window.location.href = "/login";
        // } else if (response.data.error === "User already exists") {
        //     alert("User already exists. Redirecting to login...");
        //     window.location.href = "/login";
        // } else {
        //     console.error("Registration failed:", response.data.error);
        // }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      toast.error('Lỗi kết nối, vui lòng thử lại!');
    }
  };

  return (
    <div className="h-auto bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full h-full flex flex-col rounded-lg p-10 space-y-4 bg-black justify-center items-center">
        <img className="w-10 h-10" src={assets.spotify_logo} alt="" />
        <div className="text-center">
          <label className="font-bold text-[40px]">Sign up to</label><br />
          <label className="font-bold text-[40px]">start listening</label>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4 flex flex-col items-center">
          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label>Email address</label>
            <input
              className="w-80 h-10 border border-gray rounded-lg bg-black p-2"
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <label>Password</label>
            <input
              className="w-80 h-10 border border-gray rounded-lg bg-black p-2"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-2">
            <label>Confirm Password</label>
            <input
              className="w-80 h-10 border border-gray rounded-lg bg-black p-2"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="flex flex-col space-y-1">
            <label>Name</label>
            <input
              className="w-80 h-10 border border-gray rounded-lg bg-black p-2"
              placeholder="Your name"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col space-y-1">
            <label>Date of Birth</label>
            <div className="flex space-x-2">
              <input
                className="w-20 h-10 border border-gray rounded-lg bg-black p-2"
                placeholder="DD"
                {...register('day')}
              />
              <select
                className="w-32 h-10 border border-gray rounded-lg bg-black text-white p-2"
                {...register('month')}
              >
                <option value="">Month</option>
                {[
                  '01', '02', '03', '04', '05', '06',
                  '07', '08', '09', '10', '11', '12',
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                className="w-24 h-10 border border-gray rounded-lg bg-black p-2"
                placeholder="YYYY"
                {...register('year')}
              />
            </div>
            {(errors.day || errors.month || errors.year) && (
              <p className="text-red-500 text-xs">
                {errors.day?.message || errors.month?.message || errors.year?.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="w-full flex flex-col space-y-1 p-2">
            <label className="font-bold text-left">Gender</label>
            <div className="grid grid-cols-2 gap-5 mt-2">
              {['Nam', 'Nữ'].map((option) => (
                <label key={option} className="flex space-x-2 text-white">
                  <input
                    type="radio"
                    value={option}
                    {...register('gender')}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.gender?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.gender?.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-80 h-10 font-bold border border-gray rounded-full bg-green-500 hover:bg-green-600"
          >
            Register
          </button>
        </form>

        <div className="pt-8">
          <hr className="w-80 border-t-2 border-gray-600" />
        </div>

        <div className="flex items-center">
          <span className="text-gray-400">Already have an account?</span>
          <a href="/login" className="underline ml-2 hover:text-green-500">Log in here</a>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

export default Register;
