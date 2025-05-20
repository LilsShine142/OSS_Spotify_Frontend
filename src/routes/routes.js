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

// import config from "../config";
// import { Navigate } from "react-router-dom";
// //pages 
// import Home from "../pages/Home/home";
// import HomeContainer from "../layouts/components/MainContent/HomeContainer";
// import Artist from "../layouts/components/Artist/Artist";
// import Login from "../pages/Auth/Login"
// import Register from "../pages/Auth/Register"
// import Account from "../pages/Account/account"
// import Profile from "../pages/Account/profile"
// import DefaultPage from "../layouts/Default/DefaultPage";

// // Public routes
// const publicRoutes = [
//     // Auth
//     // User
//     {
//         path: config.routes.home,
//         index: true,
//         component: Home,
//         exact: true
//     },
//     {
//         path: config.routes.home_container,
//         component: HomeContainer,
//         exact: true
//     },
//     {
//         path: config.routes.artist(':id'),
//         component: Artist,
//         exact: true
//     },
//     {
//         path: config.routes.default_page,
//         component: DefaultPage
//     },
// { path: config.routes.login, component: Login },
// { path: config.routes.register, component: Register },
// { path: config.routes.account, component: Account },
// { path: config.routes.account_profile, component: Profile },
//     // { path: "*", element: <Navigate to={config.routes.default_page} replace /> }
// ];

// export { publicRoutes };


import config from "../config";
import HomeContainer from "../client/layouts/components/MainContent/HomeContainer";
import Artist from "../client/layouts/components/Artist/Artist";
import AlbumTracksList from "../components/AlbumTracksList/AlbumTracksList";
import Login from "../client/pages/Auth/Login";
import Register from "../client/pages/Auth/Register";
import Callback from "../client/pages/Auth/Callback";
import Account from "../client/pages/Account/account";
import Profile from "../client/pages/Account/profile";
import UserProfile from "../client/layouts/components/User/UserProfile";
import DefaultPage from "../client/layouts/Default/DefaultPage";
import Library from "../client/pages/User/Library";

import AdminDashboard from "@/admin/pages/AdminLayout/Dashboard";
import ManageAlbums from "@/admin/pages/AdminLayout/ManageAlbums";
import ManageArtists from "@/admin/pages/AdminLayout/ManageArtists";
import ManageUsers from "@/admin/pages/AdminLayout/ManageUsers";
import ManageNewUser from "@/admin/pages/AdminLayout/ManageNewUser";
import Statistical from "@/admin/pages/AdminLayout/Statistical";
// Các route sử dụng layout HomeLayout
const layoutRoutes = [
    {
        path: config.routes.home,
        component: HomeContainer,
    },
    {
        path: config.routes.artist(':id'),
        component: Artist,
    },
    {
        path: config.routes.album_tracks_list(':id'),
        component: AlbumTracksList,
    },
    {
        path: config.routes.playlist_tracks_list(':id'),
        component: AlbumTracksList,
    },
    {
        path: config.routes.user_profile(':id'),
        component: UserProfile,
    },
    {
        path: config.routes.library, // ✅ Thêm Library vào layoutRoutes
        component: Library,
    },
];

// Các route không sử dụng layout
const standaloneRoutes = [
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.account, component: Account },
    { path: config.routes.account_profile, component: Profile },
    { path: config.routes.default_page, component: DefaultPage },
];

// Admin routes
const adminRoutes = [
    { path: config.routes.admin_albums, component: ManageAlbums },
    { path: config.routes.admin_artists, component: ManageArtists },
    { path: config.routes.admin_users, component: ManageUsers },
    { path: config.routes.admin_users_new, component: ManageNewUser },
    { path: config.routes.admin_statistical, component: Statistical },
];

export { layoutRoutes, standaloneRoutes, adminRoutes };
