import { assets } from '@/assets/assets'
import React from 'react'

function Register() {
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
                        <input className='w-80 h-10 border border-gray rounded-lg bg-black p-1' type="text" placeholder='Email or username' />
                        <a className='text-sm underline text-green-500' href=""> Use phoneNumber instead</a>
                    </div>
                 
                    <div className='w-[330px] h-11 flex items-center justify-center'>
                        <input 
                            className="w-80 h-10 border  font-bold  text-black border-gray-400 rounded-full bg-green-500 cursor mt-2 
                                        hover:w-[330px] hover:h-11 transition-all duration-200" 
                            type="submit" 
                            value="Next" 
                        />
                    </div>
                </form>
               
                <div className="py-8 w-full flex justify-center">
                    <hr className="w-80 border-t-2 border-gray-500" />
                </div>


                {/* SignUp */}

                <div className="flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500">
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Sign up with Google</label>
                    </div>
                </div>
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500'>
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Sign up with Facebook</label>
                    </div>
                </div>
                <div className='flex w-80 items-center border border-gray rounded-[50px] p-4 bg-black-500'>
                    <img className='ml-4 w-5 h-5' src={assets.spotify_logo} alt="" />
                    <div className='w-60 flex justify-center'>
                       <label htmlFor="">Sign up with Apple</label>
                    </div>
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