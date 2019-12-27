import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <div className="navbar-fixed">
        <nav className="green">
          <div className="container">
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo">
                Sports Hub
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
