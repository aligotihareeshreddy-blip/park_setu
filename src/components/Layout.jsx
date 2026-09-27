import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Menu, X, UserRound, PlusCircle } from "lucide-react";
import "./Layout.css";
import Logo from "./Logo";
import parksetu_logo from "../assets/parksetu-logo.png";

const getUser = () => {
  try {
    const storedUser = localStorage.getItem("parksetuUser");

    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser || !parsedUser.role || !parsedUser.email) {
      localStorage.removeItem("parksetuUser");
      return null;
    }

    return parsedUser;
  } catch {
    localStorage.removeItem("parksetuUser");
    return null;
  }
};

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getUser);

  useEffect(() => {
    const handleStorage = () => {
      setUser(getUser());
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const close = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("parksetuUser");
    setUser(null);
    close();
    window.location.href = "/";
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-inner container">
          <Logo />

          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-links ${open ? "open" : ""}`}>
            <NavLink onClick={close} to="/" end>
              Home
            </NavLink>

            <NavLink onClick={close} to="/search">
              Find Parking
            </NavLink>

            <NavLink onClick={close} to="/connect">
              Connect
            </NavLink>

            <NavLink onClick={close} to="/how-it-works">
              How It Works
            </NavLink>

            {user && (
              <NavLink onClick={close} to="/workspace">
                Workspace
              </NavLink>
            )}

            {user?.role === "user" && (
              <>
                <NavLink onClick={close} to="/bookings">
                  Bookings
                </NavLink>

                <NavLink onClick={close} to="/saved">
                  Saved
                </NavLink>
              </>
            )}

            {(!user || user.role !== "user") && (
              <NavLink onClick={close} to="/list-your-space">
                List Your Space
              </NavLink>
            )}

            <div className="nav-actions">
              {!user ? (
                <>
                  <Link
                    className="login-link"
                    onClick={close}
                    to="/login"
                  >
                    <UserRound size={17} />
                    Login
                  </Link>

                  <Link
                    className="btn btn-primary"
                    onClick={close}
                    to="/signup"
                  >
                    <PlusCircle size={17} />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="login-link"
                    onClick={close}
                    to="/dashboard"
                  >
                    <UserRound size={17} />

                    {user.role === "owner"
                      ? "Lister"
                      : user.role === "admin"
                        ? "Admin"
                        : "Account"}
                  </Link>

                  <button
                    type="button"
                    className="login-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-logo">
            <Link to="/" onClick={close}>
              <img
                src={parksetu_logo}
                alt="ParkSetu"
              />
            </Link>

            <small>
              Private parking discovery for cars and bikes.
            </small>
          </div>

          <div className="footer-column">
            <h4>Parking</h4>

            <Link to="/search?vehicle=Car">
              Car Parking
            </Link>

            <Link to="/search?vehicle=Bike">
              Bike Parking
            </Link>
          </div>

          <div className="footer-column">
            <h4>Marketplace</h4>

            <Link to="/list-your-space">
              List Your Space
            </Link>

            <Link to="/connect">
              Connect Packages
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>

            <p>Bengaluru, India</p>
            <p>support@parksetu.com</p>
            <p>www.parksetu.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} ParkSetu. Find. Book. Park. Move.
        </div>
      </footer>
    </>
  );
}