// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { publicRoutes } from "./routes";
// import { PlayerProvider } from "./context/PlayerContext/PlayerContext";

// function App() {
//   console.log("App component rendered", publicRoutes);
//   return (
//     <PlayerProvider>
//       {/* Bọc toàn bộ ứng dụng bằng PlayerProvider */}
//       <BrowserRouter>
//         <Routes>
//           {publicRoutes.map((route, index) => (
//             <Route
//               key={index}
//               path={route.path}
//               element={<route.component />}
//             />
//           ))}
//         </Routes>
//       </BrowserRouter>
//     </PlayerProvider>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext/PlayerContext";
import { layoutRoutes, standaloneRoutes, adminRoutes } from "./routes";
import HomeLayout from "./client/pages/Home/home";
import AdminLayout from "./admin/pages/AdminLayout/Dashboard";
import ManageAlbums from "./admin/pages/AdminLayout/ManageAlbums";
import CreateAlbum from "./admin/pages/AdminLayout/CreateAlbum";
import EditAlbum from "./admin/pages/AdminLayout/EditAlbum";
import ManageTracks from "./admin/pages/AdminLayout/ManageTracks";
import CreateTrack from "./admin/pages/AdminLayout/CreateTrack";
import EditTrack from "./admin/pages/AdminLayout/EditTrack";
import ManageArtists from "./admin/pages/AdminLayout/ManageArtists";
import CreateArtist from "./admin/pages/AdminLayout/CreateArtist";
import EditArtist from "./admin/pages/AdminLayout/EditArtist";
// configAxios.js hoặc ngay đầu file App.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000"; // hoặc domain backend
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          {/* Các route dùng chung layout home*/}
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            {layoutRoutes.map((route, index) => {
              const Element = route.component;
              return (
                <Route key={index} path={route.path} element={<Element />} />
              );
            })}
          </Route>

          {/* Các route không dùng chung layout home */}
          {standaloneRoutes.map((route, index) => {
            const Element = route.component;
            return (
              <Route key={index} path={route.path} element={<Element />} />
            );
          })}


          <Route path="/admin" element={<AdminLayout />}>
            <Route path="albums" element={<ManageAlbums />} />
            <Route path="create-album" element={<CreateAlbum />} /> 
            <Route path="edit-album/:albumId" element={<EditAlbum />} />
            <Route path="tracks" element={<ManageTracks />} />
            <Route path="create-track" element={<CreateTrack />} />
            <Route path="edit-track/:songId" element={<EditTrack />} />
            <Route path="artists" element={<ManageArtists />} />
            <Route path="create-artist" element={<CreateArtist />} />
            <Route path="edit-artist/:artistId" element={<EditArtist />} />
            {adminRoutes.map((route, index) => {
              const Element = route.component;
              return <Route key={index} path={route.path} element={<Element />} />;
            })}
        </Route>


        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;