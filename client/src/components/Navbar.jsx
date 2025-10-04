import { Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext.js";
import { useThemeContext } from "../context/useThemeContext.js";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { theme, toggleTheme } = useThemeContext();
  const isDusk = theme === "dusk";

  const primaryLinks = [
    { to: "/about", label: "About" },
    { to: "/resources", label: "Resources" },
    { to: "/support", label: "Support" },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("")
    : "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <nav className="nav">
        {/* Left: Brand Logo */}
        <Link className="brand" to="/">
          <img className="logo" src="/logo.jpg" alt="BeFree Logo" />
          <span className="brand-text">BeFree</span>
        </Link>

        <div className="nav-menu" ref={menuRef}>
          <button
            type="button"
            className="nav-link nav-link-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
          >
            Explore
            <span className={`nav-caret${menuOpen ? " open" : ""}`}>▾</span>
          </button>
          {menuOpen && (
            <div className="nav-dropdown">
              {primaryLinks.map((link) => (
                <Link
                  key={link.to}
                  className="dropdown-link"
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="nav-right" ref={userMenuRef}>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDusk ? "dawn" : "dusk"} theme`}
            title={`Switch to ${isDusk ? "dawn" : "dusk"} theme`}
          >
            <span aria-hidden="true">{isDusk ? "🌅" : "🌙"}</span>
          </button>
          {!user ? (
            <>
              <Link className="nav-link" to="/login">
                Log in
              </Link>
              <Link className="nav-link" to="/signup">
                Sign up
              </Link>
            </>
          ) : (
            <div className="user-menu">
              <div
                className="avatar"
                onClick={() => setOpen((prev) => !prev)}
              >
                {initials || "U"}
              </div>

              {open && (
                <div className="dropdown">
                  <Link className="dropdown-link" to="/" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                  <Link className="dropdown-link" to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <Link
                    className="dropdown-link"
                    to="/settings"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="dropdown-link"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
