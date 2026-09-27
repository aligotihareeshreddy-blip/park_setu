import React, { useEffect, useState } from "react";
import { Heart, MapPin, ShieldCheck, ChevronLeft, ChevronRight, Star, CarFront, Bike, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1562426509-5044a121aa49?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1545179605-1b29b4e1f1f0?auto=format&fit=crop&w=900&q=80",
];

const iconFor = (vehicle) => vehicle === "Bike" ? Bike : CarFront;

export default function ParkingCard({ space, saved = false, onToggleSave, compact = false }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = space.images?.length ? space.images : FALLBACK_IMAGES;
  const VehicleIcon = iconFor(space.vehicleType);

  useEffect(() => {
    if (!hovered || images.length < 2) return undefined;
    const timer = setInterval(() => setActive((index) => (index + 1) % images.length), 1100);
    return () => clearInterval(timer);
  }, [hovered, images.length]);

  useEffect(() => {
    if (!hovered) setActive(0);
  }, [hovered]);

  return (
    <article className={`parking-card ${compact ? "compact" : ""}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="parking-card-media">
        <img src={images[active]} alt={space.name} />
        <div className="parking-card-overlay" />
        <div className="card-topline">
          <span className={`listing-badge ${space.premium ? "premium" : "normal"}`}>{space.premium ? <Sparkles size={12}/> : null}{space.premium ? "Premium" : "Normal"}</span>
          <button className={`icon-btn ${saved ? "saved" : ""}`} aria-label="Save parking" onClick={(event) => { event.preventDefault(); onToggleSave?.(space.id); }}><Heart size={17} fill={saved ? "currentColor" : "none"}/></button>
        </div>
        {space.offer && <span className="offer-badge">{space.offer}</span>}
        <div className="media-controls">
          <button type="button" onClick={(event) => { event.preventDefault(); setActive((active - 1 + images.length) % images.length); }}><ChevronLeft size={15}/></button>
          <span>{active + 1}/{images.length}</span>
          <button type="button" onClick={(event) => { event.preventDefault(); setActive((active + 1) % images.length); }}><ChevronRight size={15}/></button>
        </div>
        <div className="media-dots">{images.map((_, index) => <i key={index} className={index === active ? "active" : ""} />)}</div>
      </div>
      <Link to={`/parking/${space.id}`} className="parking-card-body" onClick={() => {
        const recent = JSON.parse(localStorage.getItem("parksetuRecentViewed") || "[]");
        const next = [space.id, ...recent.filter((id) => id !== space.id)].slice(0, 6);
        localStorage.setItem("parksetuRecentViewed", JSON.stringify(next)); window.dispatchEvent(new Event("parksetuRecentViewedChanged"));
      }}>
        <div className="card-title-row"><div><span className="verified-line"><ShieldCheck size={14}/> {space.verified ? "ParkSetu verified" : "Verification pending"}</span><h3>{space.name}</h3></div><span className="rating"><Star size={13} fill="currentColor"/> {space.rating}</span></div>
        <p className="card-location"><MapPin size={14}/> {space.area} · {space.distance} km away</p>
        <div className="feature-icon-row">{space.features?.slice(0, 4).map((feature) => <span key={feature} title={feature} aria-label={feature}>{feature === "CCTV" ? "◉" : feature === "Security" ? "♢" : feature === "EV Charging" ? "ϟ" : feature === "Covered" ? "⌂" : "✓"}</span>)}</div>
        <div className="card-meta"><span><VehicleIcon size={14}/> {space.suitableFor || space.vehicleType}</span><span>{space.availability || "Monthly"}</span><strong>₹{Number(space.price).toLocaleString("en-IN")}<small>/mo</small></strong></div>
      </Link>
    </article>
  );
}
