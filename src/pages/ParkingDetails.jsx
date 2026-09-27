import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bike, CalendarDays, CarFront, CheckCircle2, Clock3, Heart, MapPin, Navigation, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";
import { parkingSpaces } from "../data/parkingData";
import { getVehicleSettings } from "../data/vehicleConfig";
import { rememberParking } from "../components/RecentViewed";
import Seo from "../components/Seo";
import "./ParkingDetails.css";

const readUser = () => { try { return JSON.parse(localStorage.getItem("parksetuUser") || "null"); } catch { return null; } };
const getSaved = () => { try { const v = JSON.parse(localStorage.getItem("parksetuSaved") || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const getToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const getDefaultToDate = () => { const d = new Date(); d.setMonth(d.getMonth()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "";
const daysBetween = (from, to) => { if (!from || !to || to < from) return 0; return Math.ceil((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`))/86400000)+1; };

export default function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const space = parkingSpaces.find((item) => item.id === id) || parkingSpaces[0];
  const user = readUser();
  const vehicleSettings = getVehicleSettings();
  const [fromDate, setFromDate] = useState(params.get("from") || getToday());
  const [toDate, setToDate] = useState(params.get("to") || getDefaultToDate());
  const [vehicle, setVehicle] = useState(params.get("vehicle") || (space.vehicleType === "Bike" ? "Bike" : "Car"));
  const [saved, setSaved] = useState(getSaved().includes(space.id));
  const [dateError, setDateError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const images = space.photos?.length ? space.photos : [];
  useEffect(() => { rememberParking(space.id); }, [space.id]);
  useEffect(() => { setActiveImage(0); }, [space.id]);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = setInterval(() => setActiveImage((index) => (index + 1) % images.length), 4500);
    return () => clearInterval(timer);
  }, [images.length, space.id]);

  const VehicleIcon = vehicle === "Car" ? CarFront : Bike;
  const days = useMemo(() => daysBetween(fromDate, toDate), [fromDate, toDate]);
  const units = useMemo(() => space.availability === "Daily" ? days : space.availability === "Weekly" ? Math.max(1, Math.ceil(days/7)) : Math.max(1, Math.ceil(days/30)), [days, space.availability]);
  const total = useMemo(() => (Number(space.price) || 0) * units, [space.price, units]);
  const deposit = Number(space.preDepositAmount || 0);
  const initialAmount = total + (space.preDeposit ? deposit : 0);

  const toggleSave = () => {
    const list = getSaved();
    const next = saved ? list.filter((item) => item !== space.id) : [...list, space.id];
    localStorage.setItem("parksetuSaved", JSON.stringify(next));
    setSaved(!saved);
  };

  const changeFromDate = (value) => { setFromDate(value); if (toDate && value > toDate) setToDate(value); setDateError(""); };
  const changeToDate = (value) => { setToDate(value); setDateError(""); };

  const book = () => {
    if (!fromDate || !toDate || toDate < fromDate) { setDateError("Please select a valid parking period."); return; }
    if (!user || user.role !== "user") { navigate(`/login?next=/parking/${space.id}`); return; }
    let bookings = []; try { bookings = JSON.parse(localStorage.getItem("parksetuBookings") || "[]"); if (!Array.isArray(bookings)) bookings=[]; } catch { bookings=[]; }
    const booking = { id:`PS-${Date.now().toString().slice(-8)}`, spaceId:space.id, spaceName:space.name, area:space.area, parkingType:space.parkingType, premium:space.premium, vehicle, fromDate, toDate, fromDateLabel:formatDate(fromDate), toDateLabel:formatDate(toDate), durationUnits:units, availability:space.availability, price:Number(space.price)||0, total, deposit, initialAmount, status:"Confirmed", createdAt:new Date().toISOString() };
    localStorage.setItem("parksetuBookings", JSON.stringify([booking, ...bookings]));
    navigate(`/bookings?booking=${booking.id}`);
  };

  const periodLabel = space.availability === "Daily" ? "day" : space.availability === "Weekly" ? "week" : "month";

  return (
    <div className="page premium-details-page">
      <Seo title={`${space.name} | ParkSetu Parking`} description={`${space.name} in ${space.area}, Bengaluru. View verified parking details, facilities, availability, pricing and lister deposit.`} path={`/parking/${space.id}`} image={space.photos?.[0]} />
      <section className="section">
        <div className="container">
          <Link className="back-link" to="/search"><ArrowLeft size={17}/> Back to parking</Link>
          <div className="details-grid">
            <main>
              <div className="details-hero image-hero">
                {images.length ? <img className="details-main-image" src={images[activeImage]} alt={`${space.name} parking space`} /> : <VehicleIcon size={96} />}
                <div className="hero-image-shade" />
                <div className="detail-hero-overlay">
                  {space.premium && <span className="hero-premium"><Sparkles size={13}/> Premium</span>}
                  <span>{space.parkingType}</span><span>{space.vehicleType}</span>{space.verified && <span><CheckCircle2 size={13}/> Verified</span>}
                </div>
                {space.offer && <span className="hero-offer">{space.offer}</span>}
                <button className={`hero-save ${saved ? "saved" : ""}`} onClick={toggleSave} type="button"><Heart size={20} fill={saved ? "currentColor" : "none"}/>{saved ? "Saved" : "Save"}</button>
                {images.length > 1 && <div className="hero-dots">{images.map((_, index) => <button aria-label={`Show image ${index+1}`} type="button" className={activeImage === index ? "active" : ""} key={index} onClick={() => setActiveImage(index)}/>)}</div>}
              </div>
              {images.length > 1 && <div className="detail-thumbs">{images.map((image,index) => <button type="button" key={image} className={activeImage===index ? "active" : ""} onClick={()=>setActiveImage(index)}><img src={image} alt="Parking view"/></button>)}</div>}

              <div className="details-info">
                <div className="details-title">
                  <div><div className="property-status"><CarFront size={14}/> {space.vehicleType}</div><h1>{space.name}</h1><p><MapPin size={16}/> {space.area}, {space.city} · {space.distance} km away</p></div>
                </div>

                <div className="trust-strip"><CheckCircle2 size={19}/><div><b>Location verified</b><span>Listing location and submitted property information have been reviewed.</span></div></div>

                {space.premium && <section className="premium-overview"><div className="premium-heading"><Sparkles size={19}/><div><b>Premium parking experience</b><span>Selected spaces with stronger facilities and a more polished parking experience.</span></div></div><div className="premium-reasons"><span><ShieldCheck size={14}/> Verified</span><span><Clock3 size={14}/> Reliable access</span><span><WalletCards size={14}/> Clear pricing</span></div></section>}

                <section className="overview-section"><h2>Parking overview</h2><p>{space.description}</p><div className="overview-grid"><div><span>Parking type</span><b>{space.parkingType}</b></div><div><span>Vehicle</span><b>{space.suitableFor}</b></div><div><span>Access</span><b>{space.access}</b></div><div><span>Availability</span><b>{space.availability}</b></div><div><span>Capacity</span><b>{space.capacity}</b></div><div><span>Location</span><b>{space.area}</b></div></div></section>

                <section className="overview-section"><h2>Facilities & features</h2><div className="amenities">{space.features.map((feature)=><span key={feature}><ShieldCheck/> {feature}</span>)}</div></section>
                <section className="overview-section"><h2>Location</h2><p><MapPin size={16}/> {space.address}</p><div className="nearby-list">{space.nearby.map((item)=><span key={item}>Nearby: {item}</span>)}</div></section>
                <section className="overview-section"><h2>Good to know</h2><div className="good-grid"><span><CheckCircle2/> Location verified</span><span><Clock3/> {space.access} access</span><span><Users/> Private property</span><span><Navigation/> Easy navigation</span></div></section>
              </div>
            </main>

            <aside className="booking-card card premium-booking-card">
              <div className="booking-card-top"><div><span className="booking-label">{space.availability} parking</span><div className="booking-price"><b>₹{Number(space.price).toLocaleString("en-IN")}</b><span>/ {periodLabel}</span></div></div><span className={`booking-property-status ${space.premium ? "is-premium" : ""}`}><Sparkles size={13}/>{space.premium ? "Premium property" : "Standard property"}</span></div>

              <div className="booking-dates-label"><CalendarDays size={15}/> Parking dates</div>
              <div className="booking-date-grid"><div><label>From date</label><div className="booking-control"><CalendarDays size={17}/><input type="date" value={fromDate} min={getToday()} onChange={(e)=>changeFromDate(e.target.value)}/></div></div><div><label>To date</label><div className="booking-control"><CalendarDays size={17}/><input type="date" value={toDate} min={fromDate || getToday()} onChange={(e)=>changeToDate(e.target.value)}/></div></div></div>
              {dateError && <div className="booking-error">{dateError}</div>}
              <label>Vehicle</label><div className="booking-control"><VehicleIcon size={17}/><select value={vehicle} onChange={(e)=>setVehicle(e.target.value)}>{vehicleSettings.car && <option value="Car">Car</option>}{vehicleSettings.bike && <><option value="Bike">Bike</option><option value="Scooter">Scooter</option></>}</select></div>
              <div className="booking-period-summary"><div><span>From</span><b>{formatDate(fromDate)}</b></div><div><span>To</span><b>{formatDate(toDate)}</b></div><div><span>Billing</span><b>{units} {periodLabel}{units !== 1 ? "s" : ""}</b></div></div>

              <div className="booking-total"><div><span>Parking charge</span><b>₹{total.toLocaleString("en-IN")}</b></div><small>₹{Number(space.price).toLocaleString("en-IN")} per {periodLabel} × {units} {periodLabel}{units !== 1 ? "s" : ""}</small></div>
              {space.preDeposit && <div className="deposit-box"><div><WalletCards size={18}/><div><b>Lister-requested deposit</b><span>₹{deposit.toLocaleString("en-IN")}</span></div></div><small>This amount is set by the lister and is paid directly to them according to the private parking arrangement. ParkSetu does not hold the rental deposit.</small></div>}
              <div className="initial-total"><span>Initial amount to plan for</span><b>₹{initialAmount.toLocaleString("en-IN")}</b></div>
              <button className="btn btn-primary booking-btn" type="button" onClick={book}>Continue to booking <ArrowLeft size={16} style={{transform:"rotate(180deg)"}}/></button>
              <span className="connect-link">Need owner connection instead?</span><small className="booking-note">Your selected date range is used to prepare the {space.availability.toLowerCase()} parking booking.</small>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
