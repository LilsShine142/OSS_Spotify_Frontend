import { assets } from '@/assets/assets'
import React, { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const handleLogin = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/spotify_app/login/", {
                email,
                password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.data.success) {
                console.log("Login successful!");
                const user = {
                    "id" : response.data.id,
                    "email" : response.data.email,
                    "role" : response.data.role,
                };
                localStorage.setItem(JSON.stringify(user)); // Store login status in local storage
                window.location.href = "/home"; // Redirect to dashboard
            } else if (response.data.error === "User not found") {
                console.log("Redirecting to register...");
                window.location.href = "/register";
            } else {
                console.log("Invalid credentials.");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

  return (
    <div>
        <div className='h-auto bg-gray-900 text-white  py-10 flex items-center justify-center'>
            <div className='w-[800px] h-auto flex flex-col  rounded-lg p-10 space-y-2 bg-black justify-center items-center'>
                <img className='w-10 h-10' src={assets.spotify_logo} alt="" />
                <h1 className='text-bold text-3xl'>Log in to Spotify</h1> <br />
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
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500 justify-center'>
                       <label htmlFor="">Continue with Phone Number</label>
                </div>

                <div className="py-8 w-full flex justify-center">
                    <hr className="w-[500px] border-t-2 border-gray-500" />
                </div>

                <form className='space-y-4 flex flex-col items-center justify-center pb-5' action="">
                    <div className='space-y-1'>
                        <label className='text-bold' htmlFor="">Email or username</label> <br />
                        <input
                            className="w-80 h-10 border border-gray rounded-lg bg-black p-1"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />

                    </div>
                    <div className='space-y-1'>
                        <label className='text-bold' htmlFor="">Password</label> <br />
                        
                        <input
                            className="w-80 h-10 border border-gray rounded-lg bg-black p-1"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />

                    </div>
                    <div className='w-[330px] h-11 flex items-center justify-center'>
                    <button
                            className="w-80 h-10 border border-gray rounded-[50px] bg-green-500"
                            type="button"
                            onClick={handleLogin}
                        >
                            Login with Spotify
                        </button>

                    </div>
                </form>
                
                <div className='flex flex-col items-center'>
                    <a href="" className="underline text-white hover:text-blue-500">Forgot your password?</a>
                    <label htmlFor="">Don't have an account</label>
                    <a href="/register" className="underline text-white hover:text-blue-500">Sign up for Spotify</a>
                </div>

            </div>
        </div>

        <div className='flex items-center justify-center text-white w-full h-[80px] bg-black'>
            <label className='text-[12px]' htmlFor="">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </label>
        </div>
    </div>
   
  )
}

export default Login