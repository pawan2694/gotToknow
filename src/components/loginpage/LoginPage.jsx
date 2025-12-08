import React from "react";
import Slideer from "../slider/Slideer";
import Login from "../Login/Login";
import "./LoginPage.css";
import bgImage from "../../assets/backgroundimage/pig-pictures-6025jrkvm8tyvp95.jpg"; 

function LoginPage() {
  return (
    <div
      className="firstPage"
      style={{
        backgroundImage: `url(${bgImage})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="loginForm">
            <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
