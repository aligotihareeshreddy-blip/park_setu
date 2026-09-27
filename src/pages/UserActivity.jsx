import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Bike, CalendarCheck, CarFront, CheckCircle2, Copy, Heart, MapPin, Share2, Ticket, Users } from "lucide-react";
import { parkingSpaces } from "../data/parkingData";
import "./UserActivity.css";

const get = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

export default function UserActivity() {
  const mode = useLocation().pathname.split("/")[1] || "bookings";
  const bookings = get("parksetuBookings", []);
  const savedIds = get("parksetuSaved", []);
  const [saved, setSaved] = useState(savedIds);
  const [copied, setCopied] = useState(false);
  const savedSpaces = useMemo(() => parkingSpaces.filter((space) => saved.includes(space.id)), [saved]);

  const remove = (id) => {
    const next = saved.filter((item) => item !== id);
    setSaved(next);
    localStorage.setItem("parksetuSaved", JSON.stringify(next));
  };

  const referral = "PARK-HAR123";
  const referralUrl = `https://www.parksetu.com/signup?ref=${referral}`;

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(referralUrl);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (mode === "saved") {
    return (
      <div className="page">
        <section className="section">
          <div className="container hub">
            <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
            <span className="eyebrow">YOUR SHORTLIST</span>
            <h1>Saved parking</h1>
            <p className="hub-sub">Keep spaces you may want to book later in one place.</p>

            <div className="hub-grid">
              {savedSpaces.map((space) => (
                <div className="hub-card" key={space.id}>
                  <div className="hub-icon">{space.vehicleType === "Car" ? <CarFront/> : <Bike/>}</div>
                  <div className="hub-card-body">
                    <div className="hub-kicker">PARKING SPACE</div>
                    <h3>{space.name}</h3>
                    <p><MapPin size={14}/> {space.area}, {space.city}</p>
                    <div className="hub-tags"><span>{space.parkingType}</span><span>₹{space.price.toLocaleString("en-IN")}/month</span></div>
                    <div className="hub-actions">
                      <Link className="btn btn-primary" to={`/parking/${space.id}`}>View overview</Link>
                      <button onClick={() => remove(space.id)}><Heart size={15} fill="currentColor"/> Remove</button>
                    </div>
                  </div>
                </div>
              ))}

              {!savedSpaces.length && (
                <div className="empty-hub">
                  <Heart size={32}/>
                  <h3>No saved spaces yet</h3>
                  <p>Tap the heart on any parking listing to save it.</p>
                  <Link className="btn btn-primary" to="/search">Find parking</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (mode === "refer") {
    return (
      <div className="page">
        <section className="section">
          <div className="container hub">
            <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>

            <div className="referral-hero">
              <div>
                <span className="eyebrow">REFER FRIENDS</span>
                <h1>Help your friends find parking.</h1>
                <p>Share your ParkSetu referral link with friends and family.</p>
              </div>
              <Users size={88}/>
            </div>

            <div className="referral-code">
              <span>Your referral code</span>
              <strong>{referral}</strong>
              <button onClick={copy}>{copied ? <CheckCircle2 size={17}/> : <Copy size={17}/>} {copied ? "Copied" : "Copy link"}</button>
            </div>

            <div className="share-grid">
              <a href={`https://wa.me/?text=${encodeURIComponent(`Find parking with ParkSetu: ${referralUrl}`)}`} target="_blank" rel="noreferrer"><Share2/> WhatsApp</a>
              <button onClick={copy}><Copy/> Copy link</button>
              <a href={`mailto:?subject=Find parking with ParkSetu&body=${encodeURIComponent(`Join ParkSetu: ${referralUrl}`)}`}><Ticket/> Email</a>
            </div>

            <div className="referral-stats">
              <div><b>5</b><span>Invited</span></div>
              <div><b>3</b><span>Joined</span></div>
              <div><b>2</b><span>Completed</span></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container hub">
          <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
          <span className="eyebrow">BOOKING ACTIVITY</span>
          <h1>My bookings</h1>
          <p className="hub-sub">Upcoming and previous monthly parking reservations in one place.</p>

          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div className="booking-status"><CalendarCheck/><span>{booking.status}</span></div>
                <div className="booking-main">
                  <h3>{booking.spaceName}</h3>
                  <p><MapPin size={14}/> {booking.area} · {booking.monthLabel || booking.month}</p>
                  <div>
                    <span>{booking.parkingType}</span>
                    <span>{booking.vehicle}</span>
                    {booking.premium && <span>Premium property</span>}
                  </div>
                </div>
                <div className="booking-side">
                  <b>₹{Number(booking.total).toLocaleString("en-IN")}</b>
                  <small>{booking.id}</small>
                  <Link to={`/parking/${booking.spaceId}`}>View space</Link>
                </div>
              </div>
            ))}

            {!bookings.length && (
              <div className="empty-hub">
                <CalendarCheck size={32}/>
                <h3>No bookings yet</h3>
                <p>Search a parking space and complete a monthly booking to see it here.</p>
                <Link className="btn btn-primary" to="/search">Find parking</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
