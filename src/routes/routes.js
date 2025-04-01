/**
 * Các Chức Năng Cần Xây Dựng
Giao diện phát nhạc (Music Player)
Hệ thống tìm kiếm bài hát, playlist, album, nghệ sĩ
Quản lý thư viện cá nhân (Library)
Chức năng Thích/Thêm vào Playlist
Hệ thống đăng nhập, đăng ký tài khoản
Trang quản lý cho Admin (Quản lý nhạc, user)
Chức năng nâng cấp Premium

=>> Các modules cần xây dựng
Auth: Login, Register
Admin: Dashboard, Manage Users, Manage Songs, Manage Playlists
User: Home, Search, Library, Liked Songs, Profile
Music: Playlist, Album, Artist, Song Detail 
Premium: Introduction, Buy Premium
Other: Setting
 */

// Danh sách các pages dự kiến
/*
Login:	Đăng nhập vào hệ thống.
Register:	Đăng ký tài khoản mới.
Home:	Trang chủ hiển thị nhạc đề xuất.
Search:	Tìm kiếm bài hát, nghệ sĩ, album.
Library:	Thư viện nhạc cá nhân.
Playlist:	Hiển thị chi tiết một playlist.
Album:	Hiển thị chi tiết một album.
Artist:	Trang của nghệ sĩ, hiển thị nhạc.
Song Detail:	Trang chi tiết một bài hát.
Liked Songs:	Danh sách bài hát đã thích.
Profile:	Hồ sơ người dùng.
Admin:	Quản lý toàn bộ hệ thống.
Premium:	Giới thiệu và mua gói Premium.
*/

import config from "../config";

//pages 
import Home from "../pages/User/home";
import testCallAPI from "../pages/TestPage/testCallAPI";

// Public routes
const publicRoutes = [
    // Auth
    // User
    { path: config.routes.home, component: Home },



    // TEST CALL API
    { path: config.routes.testCallAPI, component: testCallAPI },
];

export { publicRoutes };