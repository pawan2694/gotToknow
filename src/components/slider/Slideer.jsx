import React, { useState, useEffect } from "react";
import "./Slideer.css";
import { apiService } from "../../api/api";

function Slideer() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllImages('slider');
      if (response.success) {
        setImages(response.data);
      }
    } catch (err) {
      setError('Failed to load slider images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading slider...</div>;
  }

  if (error) {
    return <div className="text-center text-danger p-5">{error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-center p-5">No slider images available</div>;
  }

  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <img
              src={`http://localhost:5000${image.filepath}`}
              className="d-block w-100 slide-img"
              alt={image.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
              }}
            />
            {image.title && (
              <div className="carousel-caption d-none d-md-block">
                <h5>{image.title}</h5>
                {image.description && <p>{image.description}</p>}
              </div>
            )}
          </div>
        ))}
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