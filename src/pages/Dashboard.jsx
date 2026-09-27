import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bike, CalendarCheck, CarFront, CheckCircle2, Heart, LogOut, MapPin, Plus, Search, Settings2, ShieldCheck, Users } from "lucide-react";
import { parkingSpaces } from "../data/parkingData";
import { getVehicleSettings, setVehicleSettings } from "../data/vehicleConfig";
import "./SimplePages.css";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("parksetuUser") || "null");
  } catch {
    return null;
  }
};

const getStorageArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const getStorageObject = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [listing] = useState(() => getStorageObject("parksetuListing"));
  const bookings = getStorageArray("parksetuBookings");
  const saved = getStorageArray("parksetuSaved");

  if (!user) {
    return (
      <div className="page">
        <section className="section">
          <div className="container dashboard-login">
            <ShieldCheck size={42}/>
            <h1>Login to your ParkSetu workspace</h1>
            <p>Search, save and book parking from your ParkSetu account.</p>
            <Link className="btn btn-primary" to="/login">Login</Link>
          </div>
        </section>
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem("parksetuUser");
    navigate("/login");
  };

  if (user.role === "owner") {
    return (
      <div className="page">
        <section className="section">
          <div className="container dashboard">
            <div className="dash-top">
              <div>
                <span className="eyebrow">LISTER WORKSPACE</span>
                <h1>Welcome, Space Lister</h1>
                <p>Manage your parking spaces, verification and bookings.</p>
              </div>
              <button className="dash-logout" onClick={logout}><LogOut size={16}/> Sign out</button>
            </div>

            <div className="stats-grid">
              <div><b>{listing ? 1 : 0}</b><span>Total spaces</span></div>
              <div><b>{listing?.status === "Verified" ? 1 : 0}</b><span>Live</span></div>
              <div><b>{listing?.status === "Pending verification" ? 1 : 0}</b><span>Pending verification</span></div>
            </div>

            <div className="section-head">
              <div><h2>My spaces</h2><p>Keep your listings accurate and available.</p></div>
              <Link className="btn btn-primary" to="/list-your-space"><Plus size={16}/> List new space</Link>
            </div>

            {listing ? (
              <div className="owner-list-row">
                <div><b>{listing.name}</b><span>{listing.location} · {listing.parkingType} · {listing.vehicle}</span></div>
                <strong>{listing.status}</strong>
                <Link className="mini-action" to="/list-your-space">Manage</Link>
              </div>
            ) : (
              <div className="empty-owner">
                <Plus size={28}/><b>No parking space listed yet</b><span>List your first space and submit it for verification.</span>
                <Link className="btn btn-primary" to="/list-your-space">List a space</Link>
              </div>
            )}

            <div className="dashboard-logout"><button onClick={logout}><LogOut size={15}/> Sign out</button></div>
          </div>
        </section>
      </div>
    );
  }

  if (user.role === "admin") {
    return <AdminDashboard logout={logout} />;
  }

  const confirmedBookings = bookings.filter((booking) => booking.status === "Confirmed");
  const recommendedSpaces = parkingSpaces.filter((space) => space.vehicleType === "Car").slice(0, 3);

  return (
    <div className="page">
      <section className="section">
        <div className="container dashboard user-dashboard">
          <div className="user-hero">
            <div>
              <span className="eyebrow">PARKING USER</span>
              <h1>Find parking without the guesswork.</h1>
              <p>Search spaces, compare the property overview and book a monthly parking space when the details work for you.</p>
            </div>
            <div className="user-hero-icon"><CarFront size={54}/></div>
          </div>

          <div className="user-search-panel">
            <Search size={20}/>
            <input placeholder="Where do you need parking?" onKeyDown={(event) => event.key === "Enter" && navigate(`/search?q=${encodeURIComponent(event.target.value)}`)}/>
            <button className="btn btn-primary" onClick={() => navigate("/search")}>Find parking</button>
          </div>

          <div className="activity-stats">
            <div><b>{bookings.length}</b><span>Bookings</span></div>
            <div><b>{confirmedBookings.length}</b><span>Upcoming</span></div>
            <div><b>{saved.length}</b><span>Saved spaces</span></div>
          </div>

          <div className="section-head"><div><h2>Quick actions</h2><p>Everything you need as a parking seeker.</p></div></div>

          <div className="quick-grid user-quick">
            <Link to="/search"><Search/><b>Find parking</b><span>Search nearby spaces and filters</span></Link>
            <Link to="/bookings"><CalendarCheck/><b>My bookings</b><span>Upcoming and previous reservations</span></Link>
            <Link to="/saved"><Heart/><b>Saved spaces</b><span>Your shortlisted parking spaces</span></Link>
            <Link to="/refer"><Users/><b>Refer friends</b><span>Share ParkSetu with friends</span></Link>
          </div>

          <div className="section-head">
            <div><h2>Recommended parking</h2><p>Explore monthly spaces based on common parking needs.</p></div>
            <Link to="/search" className="dashboard-view-all">View all <ArrowRight size={15}/></Link>
          </div>

          <div className="recommend-grid">
            {recommendedSpaces.map((space) => (
              <Link className="recommend-card" to={`/parking/${space.id}`} key={space.id}>
                <div className="recommend-icon"><CarFront/></div>
                <div className="recommend-content">
<b>{space.name}</b>
                  <small><MapPin size={12}/> {space.area} · {space.parkingType}</small>
                  <div className="recommend-meta"><span>{space.vehicleType}</span><span>⭐ {space.rating}</span><span className="verified-label"><ShieldCheck size={12}/> Verified</span></div>
                  <strong>₹{space.price.toLocaleString("en-IN")}<em> / month</em></strong>
                </div>
              </Link>
            ))}
          </div>

          <div className="user-help-card">
            <div><ShieldCheck size={25}/><div><b>Choose with confidence</b><p>Open a parking overview to check the parking type, vehicle suitability, facilities, verification and monthly availability before booking.</p></div></div>
            <Link className="btn btn-secondary" to="/search">Explore parking <ArrowRight size={15}/></Link>
          </div>

          <div className="dashboard-logout"><button onClick={logout}><LogOut size={15}/> Sign out</button></div>
        </div>
      </section>
    </div>
  );
}

function AdminDashboard({ logout }) {
  const [settings, setSettings] = useState(getVehicleSettings);
  const [saved, setSaved] = useState(false);

  const updateVehicle = (key) => {
    const next = setVehicleSettings({ ...settings, [key]: !settings[key] });
    setSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const visibleCount = parkingSpaces.filter((space) => settings[space.vehicleType.toLowerCase()]).length;

  return (
    <div className="page">
      <section className="section">
        <div className="container dashboard">
          <div className="dash-top">
            <div>
              <span className="eyebrow">ADMIN WORKSPACE</span>
              <h1>ParkSetu operations</h1>
              <p>Manage parking availability, listings and vehicle categories.</p>
            </div>
            <button className="dash-logout" onClick={logout}><LogOut size={16}/> Sign out</button>
          </div>

          <div className="stats-grid">
            <div><b>{visibleCount}</b><span>Available listings</span></div>
            <div><b>{parkingSpaces.length}</b><span>Total listings</span></div>
            <div><b>1</b><span>Verification queue</span></div>
          </div>

          <div className="admin-settings-card">
            <div className="admin-settings-heading">
              <div><span className="eyebrow">MARKETPLACE SETTINGS</span><h2>Vehicle types</h2><p>Control which vehicle categories are available to searchers and listers.</p></div>
              <Settings2 size={26}/>
            </div>
            <div className="vehicle-setting-grid">
              <button className={`vehicle-setting ${settings.car ? "enabled" : ""}`} onClick={() => updateVehicle("car")} type="button">
                <CarFront size={24}/><span><b>Car</b><small>{settings.car ? "Enabled" : "Disabled"}</small></span><i>{settings.car ? "On" : "Off"}</i>
              </button>
              <button className={`vehicle-setting ${settings.bike ? "enabled" : ""}`} onClick={() => updateVehicle("bike")} type="button">
                <Bike size={24}/><span><b>Bike</b><small>{settings.bike ? "Enabled" : "Disabled"}</small></span><i>{settings.bike ? "On" : "Off"}</i>
              </button>
            </div>
            {saved && <div className="settings-saved"><CheckCircle2 size={15}/> Vehicle setting updated. Search and listing screens are updated automatically.</div>}
          </div>

          <div className="section-head"><div><h2>Parking spaces</h2><p>Review and manage available ParkSetu spaces.</p></div></div>

          <div className="admin-table">
            <div className="admin-row admin-head"><span>Parking space</span><span>Type</span><span>Status</span><span>Action</span></div>
            {parkingSpaces.map((space) => (
              <div className="admin-row" key={space.id}>
                <span><b>{space.name}</b><small>{space.area}</small></span>
                <span>{space.parkingType} · {space.vehicleType}</span>
                <span className="admin-status"><CheckCircle2 size={14}/> Verified</span>
                <Link className="mini-action" to={`/admin/review/${space.id}`}>Review</Link>
              </div>
            ))}
          </div>

          <div className="dashboard-logout"><button onClick={logout}><LogOut size={15}/> Sign out</button></div>
        </div>
      </section>
    </div>
  );
}
