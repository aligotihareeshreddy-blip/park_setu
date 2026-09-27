import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bike,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Heart,
  List,
  Map,
  MapPin,
  Navigation,
  Search as SearchIcon,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { parkingSpaces, parkingTypes } from "../data/parkingData";
import { getVehicleSettings } from "../data/vehicleConfig";
import RecentViewed, { rememberParking } from "../components/RecentViewed";
import "./Search.css";
import Seo from "../components/Seo";

const SAVE_KEY = "parksetuSaved";
const photoPool = [
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=900&q=80",
];

const amenityOptions = [
  ["cctv", "CCTV", ShieldCheck],
  ["security", "Security", ShieldCheck],
  ["covered", "Covered", Navigation],
  ["ev", "EV charging", Sparkles],
  ["24x7", "24/7 access", Clock3],
  ["gated", "Gated", CheckCircle2],
  ["easy", "Easy entry", Navigation],
  ["lighting", "Lighting", Sparkles],
];

const vehicleOptions = ["SUV", "Hatchback", "Sedan", "Compact SUV", "MUV", "Luxury Car", "Bike", "Scooter"];
const listerOptions = ["Individual", "Business", "Property Manager"];
const availabilityOptions = ["Daily", "Weekly", "Monthly"];

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getDefaultToDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const readSaved = () => {
  try {
    const value = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
};

const imageSetFor = (space, index) => {
  if (Array.isArray(space.photos) && space.photos.length) return space.photos;
  const start = index % photoPool.length;
  return [0, 1, 2, 3].map((offset) => photoPool[(start + offset) % photoPool.length]);
};

const includesValue = (selected, value) => selected.length === 0 || selected.includes(value);

function ParkingResultCard({ space, index, saved, toggleSave, vehicle }) {
  const [hovered, setHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = imageSetFor(space, index);
  const navigate = useNavigate();

  const openDetails = () => {
    rememberParking(space.id);
    navigate(`/parking/${space.id}`);
  };

  useEffect(() => {
    if (!hovered) return undefined;
    const timer = window.setInterval(() => setImageIndex((current) => (current + 1) % images.length), 1100);
    return () => window.clearInterval(timer);
  }, [hovered, images.length]);

  return (
    <article className="result-card compact-card result-card-clickable" onClick={openDetails} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDetails(); } }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setImageIndex(0); }} role="link" tabIndex={0} aria-label={`View details for ${space.name}`}>
      <div className="result-image image-slider" style={{ backgroundImage: `url(${images[imageIndex]})` }}>
        <div className="result-image-shade" />
        <div className="image-dots">{images.map((_, image) => <i className={image === imageIndex ? "active" : ""} key={image}/>)}</div>
        <span className="listing-type-badge">{space.premium ? <><Sparkles size={11}/> Premium</> : "Normal"}</span>
        {space.offer && <span className="offer-badge">{space.offer}</span>}
        <button className={`save-btn ${saved ? "saved" : ""}`} onClick={(event) => { event.stopPropagation(); toggleSave(space.id); }} type="button" aria-label={saved ? "Remove saved parking" : "Save parking"}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
        <span className="image-count">{imageIndex + 1}/{images.length}</span>
      </div>
      <div className="result-body compact-body">
        <div className="result-topline"><span className="verified-badge"><CheckCircle2 size={12}/> Verified</span><span className="result-rating"><Star size={11} fill="currentColor"/> {space.rating}</span></div>
        <Link to={`/parking/${space.id}`} onClick={(event) => { event.stopPropagation(); rememberParking(space.id); }}><h2>{space.name}</h2></Link>
        <p className="result-location"><MapPin size={13}/> {space.area}, {space.city} · {space.distance} km away</p>
        <p className="result-description">{space.description}</p>
        <div className="result-meta"><span><CarFront size={11}/> {space.suitableFor || space.vehicleType}</span><span>{space.parkingType}</span><span>{space.availability}</span></div>
        <div className="icon-features">{(space.features || []).slice(0, 4).map((feature) => { const match = amenityOptions.find(([key, label]) => label.toLowerCase() === feature.toLowerCase() || feature.toLowerCase().includes(label.toLowerCase().split(" ")[0])); const Icon = match?.[2] || CheckCircle2; return <span key={feature} title={feature}><Icon size={14}/><b>{feature}</b></span>; })}</div>
        <div className="result-bottom"><div><b>₹{Number(space.price).toLocaleString("en-IN")}</b><span> / {space.availability.toLowerCase()}</span><small>For the selected parking period</small></div><Link className="btn btn-primary result-action" to={`/parking/${space.id}`} onClick={(event) => { event.stopPropagation(); rememberParking(space.id); }}>View parking <ArrowIcon/></Link></div>
      </div>
    </article>
  );
}

function ArrowIcon() { return <span aria-hidden="true">↗</span>; }

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [settings, setSettings] = useState(getVehicleSettings);
  const [query, setQuery] = useState(params.get("q") || "");
  const [radius, setRadius] = useState(10);
  const [vehicleTypes, setVehicleTypes] = useState(params.get("vehicle") ? [params.get("vehicle")] : []);
  const [selectedParkingTypes, setSelectedParkingTypes] = useState([]);
  const [listingTypes, setListingTypes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedListers, setSelectedListers] = useState([]);
  const [verified, setVerified] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState("list");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const [fromDate, setFromDate] = useState(params.get("from") || getToday());
  const [toDate, setToDate] = useState(params.get("to") || getDefaultToDate());
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const sync = () => setSettings(getVehicleSettings());
    window.addEventListener("parksetuVehicleSettingsChanged", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("parksetuVehicleSettingsChanged", sync); window.removeEventListener("storage", sync); };
  }, []);

  const toggle = (setter, value) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = parkingSpaces.filter((space) => {
      const searchText = [space.name, space.area, space.city, space.address, space.parkingType].join(" ").toLowerCase();
      const supportedVehicles = space.vehicleTypes || (space.vehicleType === "Car" ? ["SUV", "Hatchback", "Sedan", "Compact SUV"] : ["Bike", "Scooter"]);
      const matchesVehicle = vehicleTypes.length === 0 || vehicleTypes.some((vehicle) => supportedVehicles.includes(vehicle) || vehicle === space.vehicleType);
      const matchesParking = includesValue(selectedParkingTypes, space.parkingType);
      const matchesListing = listingTypes.length === 0 || listingTypes.includes(space.premium ? "Premium" : "Normal");
      const matchesAvailability = availability.length === 0 || availability.includes(space.availability);
      const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every((selected) => (space.features || []).some((feature) => feature.toLowerCase().includes(selected)));
      const matchesLister = selectedListers.length === 0 || selectedListers.includes(space.listerType || "Individual");
      return (!q || searchText.includes(q)) && matchesVehicle && matchesParking && matchesListing && matchesAvailability && matchesAmenities && matchesLister && space.distance <= radius && (!verified || space.verified) && Number(space.price) <= maxPrice;
    });
    if (sort === "Price") list.sort((a, b) => a.price - b.price);
    if (sort === "Distance") list.sort((a, b) => a.distance - b.distance);
    if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, radius, vehicleTypes, selectedParkingTypes, listingTypes, availability, selectedAmenities, selectedListers, verified, maxPrice, sort]);

  const doSearch = () => {
    if (!fromDate || !toDate || toDate < fromDate) { setDateError("Please choose a valid parking period."); return; }
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (vehicleTypes[0]) next.set("vehicle", vehicleTypes[0]);
    next.set("from", fromDate); next.set("to", toDate);
    setParams(next);
  };

  const toggleSave = (id) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next); localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  };

  const clearFilters = () => {
    setRadius(10); setVehicleTypes([]); setSelectedParkingTypes([]); setListingTypes([]); setAvailability([]); setSelectedAmenities([]); setSelectedListers([]); setVerified(false); setMaxPrice(5000);
  };

  const FilterPanel = () => (
    <aside className={`search-filter-card modern-filter ${mobileFilters ? "show-mobile" : ""}`}>
      <div className="filter-head"><div><b>Filters</b><span>Refine your parking</span></div><button onClick={clearFilters} type="button"><X size={15}/> Clear</button></div>

      <label className="filter-label">Radius</label>
      <div className="filter-select-row"><select className="select" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>{[1,2,5,10,20,30].map((km) => <option key={km} value={km}>{km} km</option>)}</select><span>around search</span></div>

      <label className="filter-label">Vehicle type</label>
      <div className="filter-check-grid">{vehicleOptions.map((item) => <button type="button" key={item} className={vehicleTypes.includes(item) ? "filter-option active" : "filter-option"} onClick={() => toggle(setVehicleTypes, item)}>{item}</button>)}</div>

      <label className="filter-label">Parking type</label>
      <div className="filter-check-grid">{parkingTypes.map((item) => <button type="button" key={item} className={selectedParkingTypes.includes(item) ? "filter-option active" : "filter-option"} onClick={() => toggle(setSelectedParkingTypes, item)}>{item}</button>)}</div>

      <label className="filter-label">Listing type</label>
      <div className="filter-two-grid">{["Premium", "Normal"].map((item) => <button type="button" key={item} className={listingTypes.includes(item) ? "filter-option active" : "filter-option"} onClick={() => toggle(setListingTypes, item)}>{item === "Premium" && <Sparkles size={12}/>} {item}</button>)}</div>

      <label className="filter-label">Availability</label>
      <div className="filter-two-grid">{availabilityOptions.map((item) => <button type="button" key={item} className={availability.includes(item) ? "filter-option active" : "filter-option"} onClick={() => toggle(setAvailability, item)}>{item}</button>)}</div>

      <label className="filter-label">Parking lister</label>
      <div className="filter-two-grid">{listerOptions.map((item) => <button type="button" key={item} className={selectedListers.includes(item) ? "filter-option active" : "filter-option"} onClick={() => toggle(setSelectedListers, item)}>{item}</button>)}</div>

      <label className="filter-label">Facilities & features</label>
      <div className="filter-icon-grid">{amenityOptions.map(([key, label, Icon]) => <button type="button" title={label} key={key} className={selectedAmenities.includes(key) ? "filter-icon-option active" : "filter-icon-option"} onClick={() => toggle(setSelectedAmenities, key)}><Icon size={15}/><span>{label}</span></button>)}</div>

      <label className="filter-label">Maximum price</label>
      <div className="range-value">Up to ₹{maxPrice.toLocaleString("en-IN")} / month</div>
      <input className="price-range" type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/>
      <label className="check-line"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)}/><span>Verified spaces only</span></label>
      <div className="filter-note"><ShieldCheck size={16}/><span>Protected contact and precise location are available only after the required connection step.</span></div>
    </aside>
  );

  return (
    <div className="page">
      <Seo title="Find Parking in Bengaluru | ParkSetu" description="Search verified parking spaces by radius, vehicle type, parking type, availability, amenities and price in Bengaluru." path="/search" />
      <section className="search-hero">
        <div className="container search-hero-inner">
          <span className="eyebrow">FIND PARKING</span>
          <div className="search-heading-row"><div><h1>Find a parking space that fits your routine.</h1><p>Search by locality, choose your parking dates and compare verified properties before connecting.</p></div><div className="search-trust"><ShieldCheck size={17}/> Verified parking spaces</div></div>
          <div className="search-main-card"><div className="search-location-field"><MapPin size={19}/><div><label>Location</label><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSearch()} placeholder="Locality, landmark or parking space"/></div></div><div className="search-date-field"><CalendarDays size={19}/><div><label>From date</label><input type="date" value={fromDate} min={getToday()} onChange={(e) => { setFromDate(e.target.value); setDateError(""); }}/></div></div><div className="search-date-field"><CalendarDays size={19}/><div><label>To date</label><input type="date" value={toDate} min={fromDate || getToday()} onChange={(e) => { setToDate(e.target.value); setDateError(""); }}/></div></div><button className="btn btn-primary search-submit" onClick={doSearch} type="button"><SearchIcon size={17}/> Search</button></div>
          {dateError && <div className="search-date-error"><X size={15}/> {dateError}</div>}
          <div className="search-summary-row"><span>Parking period: <b>{formatDate(fromDate)}</b> to <b>{formatDate(toDate)}</b></span><span>{results.length} spaces within <b>{radius} km</b></span></div>
        </div>
      </section>

      <section className="section search-section"><div className="container">
        <div className="mobile-search-tools"><span>{results.length} parking spaces</span><button className="mobile-filter-btn" onClick={() => setMobileFilters((value) => !value)} type="button">Filters <ChevronDown size={15}/></button></div>
        <div className="search-layout"><FilterPanel/><main>
          <div className="results-toolbar"><div className="results-count"><b>{results.length} parking spaces</b><span>Verified options near your selected area</span></div><div className="toolbar-right"><select className="select sort-select" value={sort} onChange={(e) => setSort(e.target.value)}><option>Recommended</option><option>Price</option><option>Distance</option><option>Rating</option></select><div className="view-tools"><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} type="button"><List size={15}/> List</button><button className={view === "map" ? "active" : ""} onClick={() => setView("map")} type="button"><Map size={15}/> Map</button></div></div></div>
          {view === "map" ? <div className="map-view"><div className="map-grid"/>{results.slice(0, 8).map((space, index) => <Link key={space.id} to={`/parking/${space.id}`} onClick={() => rememberParking(space.id)} className="map-pin" style={{ left: `${12 + ((index * 17) % 75)}%`, top: `${15 + ((index * 23) % 65)}%` }} title={space.name}><MapPin size={32} fill="currentColor"/></Link>)}<div className="map-label"><b>Parking around {query || "your area"}</b><span>{results.length} available spaces</span></div></div> : <div className="result-list">{results.map((space, index) => <ParkingResultCard key={space.id} space={space} index={index} saved={saved.includes(space.id)} toggleSave={toggleSave} vehicle={vehicleTypes[0]}/>)}</div>}
          {!results.length && <div className="empty-results"><SearchIcon size={34}/><h3>No parking spaces found</h3><p>Try a wider radius or clear one of the filters.</p><button className="btn btn-primary" onClick={clearFilters} type="button">Clear filters</button></div>}
        </main></div>
      </div></section>
      <RecentViewed />
    </div>
  );
}
