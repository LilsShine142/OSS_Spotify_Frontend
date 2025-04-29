import React from "react";
import { assets } from "../../../../assets/assets";
import FooterMain from "../Footer/FooterMain";
import CustomScrollbar from "../../../../components/Scrollbar/CustomScrollbar";

const Artist = () => {
  const views = "37.424.840";
  const songs = [
    {
      title: "Wake Me Up",
      artist_name: "Avicii",
      duration: "4:07",
      views: "10M Views",
      img: assets.Avicii_banner
    },
    {
      title: "Blinding Lights",
      artist_name: "The Weeknd",
      duration: "3:22",
      views: "50M Views",
      img: assets.Avicii_banner

    },
    {
      title: "Shape of You",
      artist_name: "Ed Sheeran",
      duration: "4:24",
      views: "100M Views",
      img: assets.Avicii_banner

    },
    {
      title: "Someone Like You",
      artist: "Adele",
      duration: "4:45",
      views: "30M Views",
      img: assets.Avicii_banner

    },
    {
      title: "Believer",
      artist_name: "Imagine Dragons",
      duration: "3:37",
      views: "80M Views",
      img: assets.Avicii_banner

    },
  ];

  
  const artistName = songs[0]?.artist_name || songs[0]?.artist || "Unknown";

  const decription =
    "With his melodic songs and inspirational lyrics Swedish house producer " +
    artistName +
    " was one of the defining artists of modern pop. The genre-bending tracks captivated audiences worldwide and are widely considered the soundtrack of a generation. ...";
  const profile_img = assets.Avicii_banner


  console.log(songs);

  return (
    <div className="w-full h-[80vh] rounded-lg box-border overflow-y-auto ">
      <div className="relative">
        <img
          src={profile_img}
          alt=""
          className="w-[100%] h-[250px] z-[-10] object-cover"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-2">
            <i></i>
            <label className="text-sm" htmlFor="">
              Nghệ sĩ được xác minh
            </label>
          </div>
          <div>
            <label className="text-[75px] font-bold block" htmlFor="">
              {songs[0].artist_name}
            </label>
          </div>
          {/* <div>
            <label className="text-sm" htmlFor="">
              {views} người nghe hàng tháng
            </label>
          </div> */}
        </div>
      </div>
      <div className="bg-gradient-to-b from-zinc-800 to-black p-2 w-full h-auto ">
        <div className="w-full h-full p-3">
          {/* <div className="flex items-center justify gap-5">
            <label
              className="bg-green-500 w-[50px] h-[50px] flex items-center justify-center rounded-full"
              htmlFor=""
            >
              <img src={assets.play_icon} alt="" className="w-5" />
            </label>
            <input
              className="text-[13px] text-white font-bold border-2 border-white rounded-full py-1 px-2"
              type="button"
              value="Đang theo dõi"
            />
            <label htmlFor="">
              <img className="w-5 " src={assets.arrow_icon} alt="" />
            </label>
          </div> */}
          <div className="pb-4 pt-4">
            <div className="py-2">
              <label className="font-bold text-[30px] text-white " htmlFor="">
                Phổ biến
              </label>
            </div>
            {songs.map((song, index) => (
              <div className="w-full flex items-center p-2 bg-transparent hover:bg-gray-800 rounded-lg group transition ">
                <div className="w-[50%] flex items-center">
                  <img
                    className="w-[15px] h-[15px] hidden group-hover:block"
                    src={assets.play_icon}
                    alt=""
                  />
                  <label className="text-white group-hover:hidden" htmlFor="">
                    {index + 1}
                  </label>
                  <img
                    className="w-[40px] h-[40px] ml-6 mr-3"
                    src={song.img}
                    alt=""
                  />
                  <label
                    className="font-bold text-white text-[15px]"
                    htmlFor=""
                  >
                    {song.title}
                  </label>
                </div>

                <div className="w-[50%] flex justify-between">
                  <label
                    className="text-gray-400 group-hover:text-white"
                    htmlFor=""
                  >
                    {song.views}
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-[15px] h-[15px] opacity-0 group-hover:opacity-100 "
                      src={assets.plus_icon}
                      alt=""
                    />
                    <label className="text-gray-400" htmlFor="">
                      {song.duration}
                    </label>
                    <img
                      className="w-[15px] h-[15px] opacity-0 group-hover:opacity-100 "
                      src={assets.plus_icon}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative">
            <label className="text-[20px] font-bold" htmlFor="">
              Giới thiệu
            </label>
            <img
              className="w-[900px] h-[500px]"
              src={profile_img}
              alt=""
            />
            <div className="absolute bottom-4 left-4">
              <label className="text-white" htmlFor="">
                37.428.840 người nghe hằng tháng
              </label>
              <div className="overflow-hidden">
                <p className="text-white w-[700px] h-[60px] overflow-y-auto scrollbar-hide text-ellipsis line-clamp-3">
                  {decription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <FooterMain />
      </div>
    </div>
  );
};

export default Artist;
