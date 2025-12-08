import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ← your context

function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clear token + user
    navigate("/");     // go back to login
  };

  // Close mobile menu after clicking a link
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Main navigation">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          RimikTech
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">

            {/* Public links */}
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about" onClick={closeMenu}>About</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={closeMenu}>Services</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeMenu}>Contact</Link>
            </li>

            {/* Authenticated UI */}
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-info">
                    Hi, {user.email}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => { closeMenu(); handleLogout(); }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Not logged in → show login link
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
