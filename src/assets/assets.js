import bell_icon from './bell.png'
import home_icon from './home.png'
import like_icon from './like.png'
import loop_icon from './loop.png'
import mic_icon from './mic.png'
import next_icon from './next.png'
import play_icon from './play.png'
import pause_icon from './pause.png'
import plays_icon from './plays.png'
import prev_icon from './prev.png'
import search_icon from './search.png'
import shuffle_icon from './shuffle.png'
import speaker_icon from './speaker.png'
import stack_icon from './stack.png'
import zoom_icon from './zoom.png'
import plus_icon from './plus.png'
import arrow_icon from './arrow.png'
import mini_player_icon from './mini-player.png'
import queue_icon from './queue.png'
import volume_icon from './volume.png'
import arrow_right from './right_arrow.png'
import arrow_left from './left_arrow.png'
import spotify_logo from './spotify_logo.png'
import clock_icon from './clock_icon.png'
import avatar from './avatar.png'
import down from './down.png'
import danhdoi_album from './danhdoi-album.jpg'
import danhdoi_img_song from './danhdoi-img-song.jpg'
import tungngaynhumaimai_img from './tungngaynhumaimai-album.jpg'
import img1 from './img1.jpg'
import img2 from './img2.jpg'
import img3 from './img3.jpg'
import img4 from './img4.jpg'
import img5 from './img5.jpg'
import img6 from './img6.jpg'
import img7 from './img7.jpg'
import img8 from './img8.jpg'
import img9 from './img9.jpg'
import img10 from './img10.jpg'
import img11 from './img11.jpg'
import img12 from './img12.jpg'
import img13 from './img13.jpg'
import img14 from './img14.jpg'
import img15 from './img15.jpg'
import img16 from './img16.jpg'
import song1 from './song1.mp3'
import song2 from './song2.mp3'
import song3 from './song3.mp3'

import Avicii_banner from './Avicii_banner.jpg'

export const assets = {
    bell_icon,
    home_icon,
    like_icon,
    loop_icon,
    mic_icon,
    next_icon,
    play_icon,
    plays_icon,
    prev_icon,
    search_icon,
    shuffle_icon,
    speaker_icon,
    stack_icon,
    zoom_icon,
    plus_icon,
    arrow_icon,
    mini_player_icon,
    volume_icon,
    queue_icon,
    pause_icon,
    arrow_left,
    arrow_right,
    spotify_logo,
    clock_icon,
    down,
    avatar,
    danhdoi_album,
    danhdoi_img_song,
    tungngaynhumaimai_img,
    Avicii_banner,

}

export const albumsData = [
    {
        AlbumID: 1,
        Title: "Đánh Đổi",
        Artist: "Obito",
        CoverImage: assets.danhdoi_album,
        ReleaseDate: "2023-10-10",
        Genre: "Hip-hop",
        bgColor: "#2a4365",
        songs: [
            { SongID: 1, Title: "Intro", Duration: 60, AudioFile: "audio/intro.mp3", cover_image: assets.danhdoi_img_song },
            { SongID: 2, Title: "Xuất Phát Điểm", Duration: 200, AudioFile: "audio/xuat-phat-diem.mp3", cover_image: assets.danhdoi_img_song },
            { SongID: 3, Title: "CL5 (Interlude)", Duration: 90, AudioFile: "audio/cl5-interlude.mp3", cover_image: assets.danhdoi_img_song }
        ]
    },
    {
        AlbumID: 2,
        Title: "Future Nostalgia",
        Artist: "Dua Lipa",
        CoverImage: "images/future-nostalgia.jpg",
        ReleaseDate: "2020-03-27",
        Genre: "Pop",
        bgColor: "#742a2a",
        songs: [
            { SongID: 6, Title: "Don't Start Now", Duration: 183, AudioFile: "audio/dont-start-now.mp3" },
            { SongID: 7, Title: "Physical", Duration: 194, AudioFile: "audio/physical.mp3" },
            { SongID: 8, Title: "Levitating", Duration: 203, AudioFile: "audio/levitating.mp3" }
        ]
    },
    {
        AlbumID: 3,
        Title: "Hollywood's Bleeding",
        Artist: "Post Malone",
        CoverImage: "images/hollywoods-bleeding.jpg",
        ReleaseDate: "2019-09-06",
        Genre: "Hip-hop",
        bgColor: "#234e52",
        songs: [
            { SongID: 9, Title: "Circles", Duration: 215, AudioFile: "audio/circles.mp3" },
            { SongID: 10, Title: "Wow.", Duration: 174, AudioFile: "audio/wow.mp3" },
            { SongID: 11, Title: "Goodbyes", Duration: 178, AudioFile: "audio/goodbyes.mp3" }
        ]
    },
    {
        AlbumID: 4,
        Title: "Từng Ngày Như Mãi Mãi",
        Artist: "Bùi Trường Linh",
        CoverImage: assets.tungngaynhumaimai_img,
        ReleaseDate: "2024-02-14",
        Genre: "Hip-hop/R&B",
        bgColor: "#1f2937",
        songs: [
            { SongID: 29, Title: "Nhớ Em", Duration: 210, AudioFile: "audio/nho-em.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" },
            { SongID: 30, Title: "Từng Ngày Như Mãi Mãi", Duration: 225, AudioFile: "audio/tung-ngay-nhu-mai-mai.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" },
            { SongID: 31, Title: "Lần Cuối", Duration: 200, AudioFile: "audio/lan-cuoi.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" },
            { SongID: 32, Title: "Thời Gian Sẽ Trả Lời", Duration: 215, AudioFile: "audio/thoi-gian-se-tra-loi.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" },
            { SongID: 33, Title: "Vì Anh Đâu Có Biết", Duration: 195, AudioFile: "audio/vi-anh-dau-co-biet.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" },
            { SongID: 34, Title: "Có Một Người", Duration: 205, AudioFile: "audio/co-mot-nguoi.mp3", cover_image: "images/tung-ngay-nhu-mai-mai.jpg" }
        ]
    },
    {
        AlbumID: 5,
        Title: "Midnight Memories",
        Artist: "One Direction",
        CoverImage: "images/midnight-memories.jpg",
        ReleaseDate: "2013-11-25",
        Genre: "Pop",
        bgColor: "#a1b8c3",
        songs: [
            { SongID: 12, Title: "Best Song Ever", Duration: 209, AudioFile: "audio/best-song-ever.mp3" },
            { SongID: 13, Title: "Story of My Life", Duration: 220, AudioFile: "audio/story-of-my-life.mp3" },
            { SongID: 14, Title: "Little Things", Duration: 179, AudioFile: "audio/little-things.mp3" }
        ]
    },
    {
        AlbumID: 6,
        Title: "Lover",
        Artist: "Taylor Swift",
        CoverImage: "images/lover.jpg",
        ReleaseDate: "2019-08-23",
        Genre: "Pop",
        bgColor: "#f5b7b1",
        songs: [
            { SongID: 15, Title: "I Forgot That You Existed", Duration: 185, AudioFile: "audio/i-forgot-that-you-existed.mp3" },
            { SongID: 16, Title: "Cruel Summer", Duration: 203, AudioFile: "audio/cruel-summer.mp3" },
            { SongID: 17, Title: "Lover", Duration: 201, AudioFile: "audio/lover.mp3" }
        ]
    },
    {
        AlbumID: 7,
        Title: "Evermore",
        Artist: "Taylor Swift",
        CoverImage: "images/evermore.jpg",
        ReleaseDate: "2020-12-11",
        Genre: "Indie Folk",
        bgColor: "#e0a0b3",
        songs: [
            { SongID: 18, Title: "Willow", Duration: 230, AudioFile: "audio/willow.mp3" },
            { SongID: 19, Title: "Champagne Problems", Duration: 268, AudioFile: "audio/champagne-problems.mp3" },
            { SongID: 20, Title: "Tolerate It", Duration: 250, AudioFile: "audio/tolerate-it.mp3" }
        ]
    },
    {
        AlbumID: 8,
        Title: "No.6 Collaborations Project",
        Artist: "Ed Sheeran",
        CoverImage: "images/no6-collaborations.jpg",
        ReleaseDate: "2019-07-12",
        Genre: "Pop",
        bgColor: "#cdbd8c",
        songs: [
            { SongID: 21, Title: "I Don't Care", Duration: 218, AudioFile: "audio/i-dont-care.mp3" },
            { SongID: 22, Title: "Beautiful People", Duration: 200, AudioFile: "audio/beautiful-people.mp3" },
            { SongID: 23, Title: "South of the Border", Duration: 240, AudioFile: "audio/south-of-the-border.mp3" }
        ]
    },
    {
        AlbumID: 9,
        Title: "Reputation",
        Artist: "Taylor Swift",
        CoverImage: "images/reputation.jpg",
        ReleaseDate: "2017-11-10",
        Genre: "Pop",
        bgColor: "#1c1b1b",
        songs: [
            { SongID: 24, Title: "Look What You Made Me Do", Duration: 220, AudioFile: "audio/look-what-you-made-me-do.mp3" },
            { SongID: 25, Title: "…Ready for It?", Duration: 200, AudioFile: "audio/ready-for-it.mp3" },
            { SongID: 26, Title: "Delicate", Duration: 233, AudioFile: "audio/delicate.mp3" }
        ]
    },
    {
        AlbumID: 10,
        Title: "Take Care",
        Artist: "Drake",
        CoverImage: "images/take-care.jpg",
        ReleaseDate: "2011-11-15",
        Genre: "Hip-hop",
        bgColor: "#2f4f4f",
        songs: [
            { SongID: 27, Title: "Marvins Room", Duration: 303, AudioFile: "audio/marvins-room.mp3" },
            { SongID: 28, Title: "Make Me Proud", Duration: 212, AudioFile: "audio/make-me-proud.mp3" },
            { SongID: 29, Title: "The Ride", Duration: 280, AudioFile: "audio/the-ride.mp3" }
        ]
    },
    {
        AlbumID: 11,
        Title: "Astronomy",
        Artist: "The Weeknd",
        CoverImage: "images/astronomy.jpg",
        ReleaseDate: "2022-06-10",
        Genre: "R&B",
        bgColor: "#1d3c3d",
        songs: [
            { SongID: 30, Title: "Blinding Lights", Duration: 200, AudioFile: "audio/blinding-lights.mp3" },
            { SongID: 31, Title: "Save Your Tears", Duration: 220, AudioFile: "audio/save-your-tears.mp3" },
            { SongID: 32, Title: "In Your Eyes", Duration: 250, AudioFile: "audio/in-your-eyes.mp3" }
        ]
    },
    {
        AlbumID: 12,
        Title: "Lover",
        Artist: "Maroon 5",
        CoverImage: "images/lover-maroon5.jpg",
        ReleaseDate: "2016-02-26",
        Genre: "Pop",
        bgColor: "#8a5e2f",
        songs: [
            { SongID: 33, Title: "Sugar", Duration: 235, AudioFile: "audio/sugar.mp3" },
            { SongID: 34, Title: "Animals", Duration: 210, AudioFile: "audio/animals.mp3" },
            { SongID: 35, Title: "One More Night", Duration: 230, AudioFile: "audio/one-more-night.mp3" }
        ]
    }
];



export const songsData = [
    { SongID: 1, Title: "Intro", Duration: 60, AudioFile: "audio/intro.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 2, Title: "Xuất Phát Điểm", Duration: 200, AudioFile: "audio/xuat-phat-diem.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 3, Title: "CL5 (Interlude)", Duration: 90, AudioFile: "audio/cl5-interlude.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 4, Title: "Đầu Đường Xó Chợ", Duration: 210, AudioFile: "audio/dau-duong-xo-cho.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 5, Title: "Biên Giới Long Bình", Duration: 195, AudioFile: "audio/bien-gioi-long-binh.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 6, Title: "16", Duration: 180, AudioFile: "audio/16.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 7, Title: "Sài Gòn Ơi", Duration: 200, AudioFile: "audio/saigon-oi.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 8, Title: "Trốn Chạy", Duration: 220, AudioFile: "audio/tron-chay.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 9, Title: "Cất Cánh (Interlude)", Duration: 85, AudioFile: "audio/cat-canh-interlude.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 10, Title: "Hà Nội", Duration: 210, AudioFile: "audio/ha-noi.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 11, Title: "Vô Điều Kiện", Duration: 190, AudioFile: "audio/vo-dieu-kien.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 12, Title: "Đánh Đổi", Duration: 190, AudioFile: "audio/danh-doi.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 13, Title: "Backstage Freestyle", Duration: 175, AudioFile: "audio/backstage-freestyle.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 14, Title: "Tell The Kids I Love Them", Duration: 200, AudioFile: "audio/tell-the-kids.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 15, Title: "Ước Mơ Của Mẹ (Interlude)", Duration: 95, AudioFile: "audio/uoc-mo-cua-me.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 16, Title: "Con Kể Ba Nghe", Duration: 205, AudioFile: "audio/con-ke-ba-nghe.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 17, Title: "Champion", Duration: 215, AudioFile: "audio/champion.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 18, Title: "Chưa Xong", Duration: 185, AudioFile: "audio/chua-xong.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 19, Title: "Tự Sự", Duration: 195, AudioFile: "audio/tu-su.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 20, Title: "Outro", Duration: 90, AudioFile: "audio/outro.mp3", cover_image: "assets/danhdoi-album.jpg" },

    // Bài hát mới từ ID 21 trở đi
    { SongID: 21, Title: "Thương Nhau Nha", Duration: 215, AudioFile: "audio/thuong-nhau-nha.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 22, Title: "Anh Luôn Như Vậy", Duration: 220, AudioFile: "audio/anh-luon-nhu-vay.mp3", cover_image: "assets/danhdoi-album.jpg" },
    { SongID: 23, Title: "Don't Start Now", Duration: 183, AudioFile: "audio/dont-start-now.mp3", cover_image: "images/future-nostalgia.jpg" },
    { SongID: 24, Title: "Physical", Duration: 194, AudioFile: "audio/physical.mp3", cover_image: "images/future-nostalgia.jpg" },
    { SongID: 25, Title: "Levitating", Duration: 203, AudioFile: "audio/levitating.mp3", cover_image: "images/future-nostalgia.jpg" },
    { SongID: 26, Title: "Circles", Duration: 215, AudioFile: "audio/circles.mp3", cover_image: "images/hollywoods-bleeding.jpg" },
    { SongID: 27, Title: "Wow.", Duration: 174, AudioFile: "audio/wow.mp3", cover_image: "images/hollywoods-bleeding.jpg" },
    { SongID: 28, Title: "Goodbyes", Duration: 178, AudioFile: "audio/goodbyes.mp3", cover_image: "images/hollywoods-bleeding.jpg" }
];

