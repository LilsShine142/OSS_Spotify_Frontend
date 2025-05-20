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

     // Auth
    login: '/login',
    register: '/register',

    // User
    home: '/home',
    artist: (id) => `/home/artist/${id}`,
    album_tracks_list: (id) => `/home/album/${id}`,
    playlist_tracks_list: (id) => `/home/playlists/${id}`,
    library: '/library',
    account: '/account',
    account_profile: '/account/profile',
    user_profile: (id) => `/user/profile/${id}`,

    // Admin
    admin_dashboard: '/admin/dashboard',
    admin_users: '/admin/users',
    admin_songs: '/admin/songs',
    admin_playlists: '/admin/playlists',
    admin_albums: '/admin/albums',
    admin_artists: '/admin/artists',
    admin_users: '/admin/users',
    admin_users_new: '/admin/users/new',
    admin_statistical: '/admin/statistical',

    default_page: '*',
};

export default routes;