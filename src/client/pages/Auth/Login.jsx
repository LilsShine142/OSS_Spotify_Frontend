import { assets } from "@/assets/assets";
import React, { useState, useContext } from "react";
import axios from "axios";
import z, { defaultErrorMap } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/authService";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleLogin } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/AuthContext/AuthContext";

function Login() {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 kí tự"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  // Hàm xử lý submit form đăng nhập
  const handleLogin = async (data) => {
    try {
      const response = await login(data.email, data.password);

      if (!response.success) {
        toast.error(response.error || "Email hoặc mật khẩu không chính xác.");
        return;
      }

      // Lấy token nếu có từ response (hoặc lấy từ cookie nếu server set cookie tự động)
      const token = response.token || Cookies.get("access_token");

      // Cập nhật context user
      loginUser(
        {
          id: response._id,
          role: response.role,
        },
        token
      );

      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.error || "Lỗi kết nối máy chủ. Vui lòng thử lại";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="h-auto bg-gray-900 text-white  py-10 flex items-center justify-center">
        <div className="w-[800px] h-auto flex flex-col  rounded-lg p-10 space-y-2 bg-black justify-center items-center">
          <img className="w-10 h-10" src={assets.spotify_logo} alt="" />
          <h1 className="text-bold text-3xl">Log in to Spotify</h1> <br />
          {/* <div className="flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500">
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Continue with Google</label>
                    </div>
                </div>
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500'>
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Continue with Facebook</label>
                    </div>
                </div>
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500'>
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Continue with Apple</label>
                    </div>
                </div> */}
          <div className="flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500 justify-center">
            <label htmlFor="">Continue with Phone Number</label>
          </div>
          <div className="py-8 w-full flex justify-center">
            <hr className="w-[500px] border-t-2 border-gray-500" />
          </div>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-4 flex flex-col items-center justify-center pb-5"
            action=""
          >
            <div className="space-y-1">
              <label className="text-bold" htmlFor="">
                Email or username
              </label>
              <br />
              <input
                className="w-80 h-10 border border-gray rounded-lg bg-black p-1"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-bold" htmlFor="">
                Password
              </label>
              <br />
              <input
                className="w-80 h-10 border border-gray rounded-lg bg-black p-1"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="text-red-500 text-xs">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="w-[330px] h-11 flex items-center justify-center">
              <button
                className="w-80 h-10 border border-gray rounded-[50px] bg-green-500"
                type="submit"
              >
                Login with Spotify
              </button>
            </div>
          </form>
          <div className="flex flex-col items-center">
            <a href="" className="underline text-white hover:text-blue-500">
              Forgot your password?
            </a>
            <label htmlFor="">Don't have an account</label>
            <a
              href="/register"
              className="underline text-white hover:text-blue-500"
            >
              Sign up for Spotify
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center text-white w-full h-[80px] bg-black">
        <label className="text-[12px]" htmlFor="">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </label>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Login;
