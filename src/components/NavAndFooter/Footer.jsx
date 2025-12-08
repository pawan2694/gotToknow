import React from "react";

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">RimikTech</h2>
          <small>© {new Date().getFullYear()} RimikTech. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
