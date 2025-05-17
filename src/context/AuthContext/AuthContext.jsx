import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserInfo } from "@/services/userService";

export const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //   useEffect(() => {
  //     const token = Cookies.get("access_token");

  //     if (!token) return;

  //     const fetchUser = async () => {
  //       try {
  //         const userData = await getUserInfo(user.id, token);
  //         if (userData.success) {
  //           setUser(userData.user);
  //         } else {
  //           Cookies.remove("access_token");
  //           setUser(null);
  //         }
  //       } catch (error) {
  //         console.error("Lỗi khi lấy thông tin người dùng:", error);
  //         Cookies.remove("access_token");
  //         setUser(null);
  //       }
  //     };

  //     fetchUser();
  //   }, [user]);

  // Thay đổi tên hàm login để rõ ràng, cũng lưu cookie và user info nếu cần
  const loginUser = async (userInfo, token) => {
    try {
      const userData = await getUserInfo(userInfo.id, token);
      if (userData.success) {
        userData.token = token;
        setUser(userData);
      } else {
        Cookies.remove("access_token");
        setUser(null);
      }
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      Cookies.remove("access_token");
      setUser(null);
    }

    if (token) Cookies.set("access_token", token);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    Cookies.remove("access_token");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
