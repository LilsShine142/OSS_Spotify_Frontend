const routes = {
    /*// Auth (Đăng nhập, Đăng ký)
    login
    register
    */

    /*// Admin (Quản lý nhạc, tài khoản)
    dashboard
    manage-users
    manage-songs
    manage-playlists
    */

    /*// User (Trang chính, nghe nhạc, playlist)
    home: Trang chủ hiển thị nhạc đề xuất
    search: Tìm kiếm bài hát, album, nghệ sĩ
    libary: Thư viện nhạc cá nhân
    playlist: Hiển thị danh sách playlist - chi tiết playlist
    album: Hiển thị danh sách album - chi tiết album
    artist: Trang cá nhân nghệ sĩ - hiển thị nhạc của nghệ sĩ
    song
    likedsongs
    profile
    setting
    // Premium
    { 
    }
    // Other
    */

    // Auth
    // login: '/login',
    // register: '/register',

    // User
    artist: (id) => `/artist/${id}`,
    album_tracks_list: (id) => `/album/${id}`,
    playlist_tracks_list: (id) => `/playlist/${id}`,
    liked_songs_collection: '/collection/likedsongs',
    home: '/home',
    login: '/login',
    register: 'register',
    account: 'account',
    account_profile: 'account/profile',
    user_profile: (id) => `/user/profile/${id}`,
    default_page: '*',
    library: "/library", // ✅ Thêm dòng này

    // Admin
    admin_dashboard: '/admin',
};

export default routes;