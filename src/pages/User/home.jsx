import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/components/Sidebar/Sidebar";
import Header from "../../layouts/components/Header/Header";
const Home = () => {
  //   const [data, setData] = useState([]);

  //   useEffect(() => {}, []);

  return (
    <div className="h-screen bg-black">
      {/* Header */}
      <Header />
      <div className="h-[90%] flex">
        <Sidebar />
        <h1>Welcome to the Home Page</h1>
      </div>
    </div>
  );
};

export default Home;
