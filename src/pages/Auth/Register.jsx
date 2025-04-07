import { assets } from '@/assets/assets'
import React from 'react'
import { useState } from "react";
import axios from "axios";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfPassword] = useState("");
//only have email textbox, click on register to check if user exists in backend, if success add password and confirmpassword textboxes(update later or never=)))

    const handleRegister = async () => {
        try {
            if (password !== confirmpassword) {
                console.error("Passwords do not match!");
                alert("Passwords do not match. Please try again."); // Display an alert to the user
                return; // Stop the registration process
            }        
            const response = await axios.post("http://127.0.0.1:8000/spotify/api/register/", {
                email,
                password,
                confirmpassword
            });
            if (response.data.success) {
                console.log("Registration successful!");
                window.location.href = "/login";
            } 
            else if (response.data.error === "User already exists") {
                console.log("User already exists. Redirecting to login...");
                window.location.href = "/login";
            }else {
                console.error("Registration failed:", response.data.error);
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

  return (
    <div>
        <div className='h-auto bg-gray-900 text-white flex items-center justify-center'>
            <div className='w-full h-full flex flex-col  rounded-lg p-10 space-y-4 bg-black justify-center items-center'>
                <img className='w-10 h-10' src={assets.spotify_logo} alt="" />
                <div className='flex flex-col justify-center items-center'>
                    <label className='font-bold font-arial text-[40px]'>Sign up to</label>
                    <label className='font-bold text-[40px]' htmlFor="">
                        start listening
                    </label>
                </div>
               
               
                <form className='space-y-4 flex flex-col items-center justify-center ' action="">
                    <div className=' flex flex-col space-y-2'>
                        <label className='text-bold' htmlFor="">Email address</label>
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <a className='text-sm underline text-green-500' href=""> Use phoneNumber instead</a>
                    </div>
                    <div className=' flex flex-col space-y-2'>
                        <label className='text-bold' htmlFor="">Password</label>
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className=' flex flex-col space-y-2'>
                        <label className='text-bold' htmlFor="">Confirm Password</label>
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="password"
                        placeholder="Confirm your password"
                        value={confirmpassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        />
                    </div>
                    <div className='w-[330px] h-11 flex items-center justify-center'>
                        <button className="w-80 h-10 border  font-bold  text-black border-gray-400 rounded-full bg-green-500 cursor mt-2 
                        hover:w-[330px] hover:h-11 transition-all duration-200" 
                            onClick={handleRegister}>Register
                        
                        </button>
                    </div>
                </form>
               
                <div className="py-8 w-full flex justify-center">
                    <hr className="w-80 border-t-2 border-gray-500" />
                </div>

                {/* Footer */}
                <div className='flex items-center'>
                    <label className='text-gray-400' htmlFor="">Already have an account?</label>
                    <a href="/login" className="underline text-white hover:text-blue-500">Log in here?</a>
                </div>


                <div className='flex flex-col items-center justify-center text-white w-full h-[80px] bg-black'>
                    <label className='text-[12px]' htmlFor="">
                        This site is protected by reCAPTCHA and the Google 
                    </label>
                    <label className='text-[12px]' htmlFor="">
                        Privacy Policy and Terms of Service apply.
                    </label>
                </div>

            </div>
        </div>

    </div>
   
  )
}

export default Register