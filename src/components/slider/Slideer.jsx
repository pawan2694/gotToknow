import React from "react";
import "./Slideer.css";
import img1 from "../../assets/3b484b7c-96c3-419e-a1b2-12e34bb9cb1c.jpg";
import img2 from "../../assets/375638.png";
import img3 from "../../assets/happy_piggirl_by_digitalcirce-d5hjd19.jpg";

function Slideer() {
  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"  
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={img1} className="d-block w-100 slide-img" alt="slide1" />
        </div>

        <div className="carousel-item">
          <img src={img2} className="d-block w-100 slide-img" alt="slide2" />
        </div>

        <div className="carousel-item">
          <img src={img3} className="d-block w-100 slide-img" alt="slide3" />
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Slideer;
