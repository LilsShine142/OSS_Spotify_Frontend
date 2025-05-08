import { assets } from "../../../../assets/assets";
import React from "react";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
function FooterMain() {
  return (
    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
        {/* Cột 1 */}
        <div>
          <h3 className="font-bold text-lg">Công ty</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <a href="#">Giới thiệu</a>
            </li>
            <li>
              <a href="#">Việc làm</a>
            </li>
            <li>
              <a href="#">For the Record</a>
            </li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-bold text-lg">Cộng đồng</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <a href="#">Dành cho các Nghệ sĩ</a>
            </li>
            <li>
              <a href="#">Nhà phát triển</a>
            </li>
            <li>
              <a href="#">Quảng cáo</a>
            </li>
            <li>
              <a href="#">Nhà đầu tư</a>
            </li>
            <li>
              <a href="#">Nhà cung cấp</a>
            </li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-bold text-lg">Liên kết hữu ích</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <a href="#">Hỗ trợ</a>
            </li>
            <li>
              <a href="#">Ứng dụng Di động Miễn phí</a>
            </li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h3 className="font-bold text-lg">Các gói của Spotify</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <a href="#">Premium Individual</a>
            </li>
            <li>
              <a href="#">Premium Student</a>
            </li>
            <li>
              <a href="#">Spotify Free</a>
            </li>
          </ul>
        </div>

        <div className="flex mt-4 space-x-2">
          <a
            href="#"
            className="bg-gray-800 p-2 w-10 h-10 rounded-full flex items-center"
          >
            <Facebook />
          </a>
          <a
            href="#"
            className="bg-gray-800 p-2 w-10 h-10  rounded-full flex items-center"
          >
            <Instagram />
          </a>
          <a
            href="#"
            className="bg-gray-800 p-2 w-10 h-10  rounded-full flex items-center"
          >
            <Twitter />
          </a>
        </div>
      </div>

      {/* Đường kẻ ngang */}
      <hr className="border-gray-700 my-6" />

      {/* Chính sách và bản quyền */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between text-gray-400 text-sm">
        <div className="space-x-4">
          <a href="#">Pháp lý</a>
          <a href="#">Trung tâm an toàn và quyền riêng tư</a>
          <a href="#">Chính sách quyền riêng tư</a>
          <a href="#">Cookie</a>
          <a href="#">Giới thiệu Quảng cáo</a>
          <a href="#">Hỗ trợ tiếp cận</a>
        </div>
        <p className="mt-2">© 2025 Spotify AB</p>
      </div>

      {/* Mạng xã hội */}
    </footer>
  );
}

export default FooterMain;
