import { assets } from '@/assets/assets'
import AccountHeader from '@/layouts/components/Account/AccountHeader'
import FooterMain from '@/layouts/components/Footer/FooterMain'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function profile() {
        const navigate = useNavigate();
    
  return (
    <div className='w-full bg-[#121212]'>
        {/* Header */}
        <AccountHeader/>


        {/* Main Content */}
        <div className='w-full h-auto flex flex-col items-center justify-center'>
            <div className='w-full max-w-[800px] bg-[#121212] py-10 p-2  space-y-4 text-white'>
                
                <img className='w-12 h-12 bg-[#292929] rounded-full p-3 hover:bg-gray-700' onClick={() => navigate("/account")} src={assets.arrow_left} alt="" />

                <h1 className='text-[40px] tracking-tighter font-bold py-5'>Chỉnh sửa hồ sơ</h1>
                <div className='text-white '>
                    <label className='font-semibold' htmlFor="">Tên người dùng</label> <br />
                    <label htmlFor="">31r7ybnj77r6d2ps6c2lknjnezi4</label>
                </div>
                <form className='w-full space-y-6' action="">
                    <div className='w-full flex flex-col text-white gap-2'>
                        <label className='font-semibold' htmlFor="">Email</label>
                        <input className='bg-[#121212] border border-white p-3 rounded-[3px]' type="text" value="vhuynh414@gmail.com" />
                    </div>

                    <div className='w-full flex flex-col text-white gap-2'>
                        <label className='font-semibold' htmlFor="">Mật khẩu</label>
                        <input className='bg-[#121212] border border-white p-3 rounded-[3px]' type="text"  disabled  />
                    </div>

                    <div className="w-full flex flex-col text-white gap-2">
                        <label className="font-semibold" htmlFor="gender">Giới tính</label>
                        <select 
                            id="gender" 
                            className="bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>


                    <div className="w-full flex flex-col text-white gap-2">
                        <label className="font-semibold" htmlFor="">Ngày sinh</label>
                        <div className="flex gap-4">
                            {/* Ngày */}
                            <input 
                                className="w-1/3 bg-[#121212] border border-white p-3 rounded-[3px] text-white " 
                                type="text" 
                                value="1"
                            />

                            {/* Tháng */}
                            <select 
                                className="w-1/3 bg-[#121212] border border-white p-3 rounded-[3px] text-white flex justify-start"
                            >
                                <option value="1">Tháng Một</option>
                                <option value="2">Tháng Hai</option>
                                <option value="3">Tháng Ba</option>
                                <option selected value="4">Tháng Tư</option>
                                <option value="5">Tháng Năm</option>
                                <option value="6">Tháng Sáu</option>
                                <option value="7">Tháng Bảy</option>
                                <option value="8">Tháng Tám</option>
                                <option value="9">Tháng Chín</option>
                                <option value="10">Tháng Mười</option>
                                <option value="11">Tháng Mười Một</option>
                                <option value="12">Tháng Mười Hai</option>

                            </select>

                            {/* Năm */}
                            <input 
                                className="w-1/3 bg-[#121212] border border-white p-3 rounded-[3px] text-white" 
                                type="text" 
                                value="2004"
                            />
                        </div>
                    </div>


                    <div className="w-full flex flex-col text-white gap-2">
                        <label className="font-semibold" htmlFor="country">Quốc gia hoặc khu vực</label>
                        <select 
                            id="country" 
                            className="bg-[#121212] border border-white p-3 rounded-[3px] text-white"
                        >
                            <option value="vn">Việt Nam</option>
                        </select>
                    </div>

                    
                    <div className='flex items-center  text-white gap-2'>
                        <input className="w-4 h-4 border border-gray-400 hover:ring-2 hover:ring-green-500" type="checkbox" />
                        <label className='font-semibold text-sm' htmlFor="">Chia sẻ dữ liệu đăng ký của tôi với các nhà cung cấp nội dung Spotify cho mục đích tiếp thị.</label>
                    </div>
                    <div className='w-full h-auto flex items-center justify-end gap-10 text-white font-semibold'>
                        <label htmlFor="">Hủy</label>
                        <button className='border border-white bg-green-500 text-black rounded-full px-5 py-2 hover:px-6 py-2'>Lưu hồ sơ</button>
                    </div>
                    <div className='flex justify-center'>
                        <label className='text-[10px]' htmlFor="">Trang web này được bảo vệ bằng reCAPTCHA và tuân theo Chính sách quyền riêng tư cũng như Điều khoản dịch vụ của Google.</label>
                    </div>
                </form>
            </div>
        </div>

        <div className='w-full'>
            <FooterMain/>
        </div>
    </div>
  )
}

export default profile