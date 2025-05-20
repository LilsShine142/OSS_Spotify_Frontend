import { assets } from '@/assets/assets';
import React from 'react';
import axios from 'axios';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleRegister } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const schema = z
  .object({
    email: z.string().email({ message: 'Email không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 kí tự'),
    confirmPassword: z.string().min(6, 'Vui lòng xác nhận mật khẩu'),
    name: z.string().min(6, 'Tên của bạn ít nhất 6 kí tự'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh không hợp lệ (YYYY-MM-DD)'),
    gender: z.string().nonempty({ message: 'Hãy chọn giới tính' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });


function Register() {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await handleRegister(data);
      if (res.message === 'success') {
        toast.success('Tạo tài khoản thành công');
        navigate("/login")
      }
    } catch (err) {
      console.error(err);
      toast.error('Tạo tài khoản thất bại');
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label>Email address</label>
            <input
              autoComplete="off"
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
            <label>Date of Birth (YYYY-MM-DD)</label>
            <input
              className="w-80 h-10 border border-gray rounded-lg bg-black p-2"
              placeholder="e.g., 2000-12-25"
              {...register('dob')}
            />
            {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
          </div>

          {/* Gender */}
          <div className="w-full flex flex-col space-y-1 p-2">
            <label className="font-bold text-left">Gender</label>
            <div className="grid grid-cols-2 gap-5 mt-2">
              {['Male', 'Female'].map((option) => (
                <label key={option} className="flex space-x-2 text-white">
                  <input type="radio" value={option} {...register('gender')} />
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
