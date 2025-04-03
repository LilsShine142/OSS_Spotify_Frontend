import React, { useState } from 'react';
import { Menu, KeyboardArrowDown } from "@mui/icons-material";
import { assets } from '@/assets/assets';
import { Link } from 'react-router-dom';

const Acc_header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='flex w-auto h-[50px] bg-[#121212] items-center justify-between px-4 py-8 lg:px-[200px]'>
            <div className='flex items-center'>
                <img className='w-8 h-8' src={assets.spotify_logo} alt="Spotify Logo" />
                <label className='text-lg font-semibold text-white ml-2'>Spotify</label>
            </div>
            <div className='flex items-center space-x-8 '>
                <div className='space-x-10 text-white font-semibold hidden lg:flex'>
                    <label className='hover:text-green-500 cursor-pointer'>Premium</label>
                    <label className='hover:text-green-500 cursor-pointer'>Hỗ trợ</label>
                    <label className='hover:text-green-500 cursor-pointer'>Tải xuống</label>
                </div>
                <div>
                    <hr className='w-[2px] h-[20px] bg-white hidden lg:flex' />
                </div>
                {/* Avatar */}
                <img className='w-10 h-10 rounded-full' src={assets.avatar} alt="User Avatar" />
                <label className='text-white lg:hidden cursor-pointer'>
                    <Menu />
                </label>
                {/* Hồ sơ dropdown */}
                <div className='relative text-white hover:text-green-500 hidden lg:block' onClick={() => setIsOpen(!isOpen)}>
                    <label className='font-semibold cursor-pointer'>Hồ sơ</label>
                    <KeyboardArrowDown />
                    {isOpen && (
                        <div className="absolute top-8 -translate-x-10 mt-1 w-40 bg-gray-800 text-white rounded-lg shadow-lg p-2 z-10">
                            <a href='../account' className="block px-4 py-2 hover:bg-gray-700 cursor-pointer">Tài khoản</a>
                            <a href='home' className="block px-4 py-2 hover:bg-gray-700 cursor-pointer">Đăng xuất</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Acc_header;
