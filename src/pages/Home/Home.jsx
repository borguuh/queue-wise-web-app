import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="menu">
        <Sidebar />
      </div>
      <div className="content">
        <Navbar />
      </div>
    </div>
  );
};

export default Home;
