import { assets } from '@/assets/assets'
import React from 'react'

function Login() {
  return (
    <div>
        <div className='h-auto bg-gray-900 text-white  py-10 flex items-center justify-center'>
            <div className='w-[800px] h-auto flex flex-col  rounded-lg p-10 space-y-2 bg-black justify-center items-center'>
                <img className='w-10 h-10' src={assets.spotify_logo} alt="" />
                <h1 className='text-bold text-3xl'>Log in to Spotify</h1> <br />
                <div className="flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500">
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
                </div>
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500 justify-center'>
                       <label htmlFor="">Continue with Phone Number</label>
                </div>


                <div className="py-8 w-full flex justify-center">
                    <hr className="w-[500px] border-t-2 border-gray-500" />
                </div>

                
                <form className='space-y-4 flex flex-col items-center justify-center pb-5' action="">
                    <div className='space-y-1'>
                        <label className='text-bold' htmlFor="">Email or username</label> <br />
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="text" placeholder='Email or username' />
                    </div>
                    <div className='space-y-1'>
                        <label className='text-bold' htmlFor="">Password</label> <br />
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="password" placeholder='Password' />
                    </div>
                    <div className='w-[330px] h-11 flex items-center justify-center'>
                        <input 
                            className="w-80 h-10 border border-gray-400 rounded-full bg-green-500 mt-2 
                                        hover:w-[330px] hover:h-11 transition-all duration-200" 
                            type="submit" 
                            value="Login" 
                        />
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