import React, { useEffect, useState } from "react";
import { ArrowRight, CarFront, Clock3, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { parkingSpaces } from "../data/parkingData";
import "./RecentViewed.css";

const KEY = "parksetuRecentlyViewed";

export const rememberParking = (id) => {
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [id, ...current.filter((item) => item !== id)].slice(0, 6);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* local-only UI state */ }
};

export default function RecentViewed() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem(KEY) || "[]");
      setItems(ids.map((id) => parkingSpaces.find((space) => space.id === id)).filter(Boolean));
    } catch { setItems([]); }
  }, []);

  if (!items.length) return null;
  return (
    <section className="recent-section"><div className="container"><div className="home-section-head"><div><span className="eyebrow">RECENTLY VIEWED</span><h2>Pick up where you left off.</h2></div></div><div className="recent-grid">{items.map((space) => <Link className="recent-card" key={space.id} to={`/parking/${space.id}`}><div className="recent-thumb"><CarFront size={28}/></div><div><b>{space.name}</b><span><MapPin size={12}/> {space.area} · {space.distance} km</span><strong>₹{space.price.toLocaleString("en-IN")} <small>/ {space.availability.toLowerCase()}</small></strong></div><ArrowRight size={16}/></Link>)}</div></div></section>
  );
}
