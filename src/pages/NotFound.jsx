import React from "react";
import { Link } from "react-router-dom";
import "./SimplePages.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <span>404</span>
      <h1>Parking spot not found.</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link className="btn btn-primary" to="/">Back to ParkSetu</Link>
    </div>
  );
}
