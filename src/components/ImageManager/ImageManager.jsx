import React, { useState, useEffect } from 'react';
import { apiService } from '../../api/api';
import './ImageManager.css';

function ImageManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'slider'
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const category = filter === 'all' ? null : filter;
      const response = await apiService.getAllImages(category);
      if (response.success) {
        setImages(response.data);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', selectedFile);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);

    try {
      setLoading(true);
      const response = await apiService.uploadImage(uploadData);
      if (response.success) {
        alert('Image uploaded successfully!');
        setFormData({ title: '', description: '', category: 'slider' });
        setSelectedFile(null);
        document.getElementById('fileInput').value = '';
        fetchImages();
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await apiService.deleteImage(id);
      alert('Image deleted successfully!');
      fetchImages();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="image-manager">
      <h2>Image Manager</h2>

      {/* Upload Form */}
      <div className="upload-section">
        <h3>Upload New Image</h3>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Image File:</label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Image title"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Image description"
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="slider">Slider</option>
              <option value="background">Background</option>
              <option value="profile">Profile</option>
              <option value="gallery">Gallery</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <label>Filter by category:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="slider">Slider</option>
          <option value="background">Background</option>
          <option value="profile">Profile</option>
          <option value="gallery">Gallery</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <h3>Uploaded Images ({images.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : images.length === 0 ? (
          <p>No images found</p>
        ) : (
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <img
                  src={`http://localhost:5000${image.filepath}`}
                  alt={image.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Error';
                  }}
                />
                <div className="image-info">
                  <h4>{image.title}</h4>
                  <p>{image.description}</p>
                  <span className="category-badge">{image.category}</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageManager;