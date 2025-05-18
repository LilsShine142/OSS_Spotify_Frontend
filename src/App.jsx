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
