import React, { useMemo } from "react";
import { ArrowRight, CarFront, CheckCircle2, Clock3, MapPin, Navigation, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { parkingSpaces } from "../data/parkingData";
import RecentViewed from "../components/RecentViewed";
import "./Home.css";
import Seo from "../components/Seo";

export default function Home() {
  const featured = useMemo(() => parkingSpaces.filter((space) => space.verified).slice(0, 3), []);

  return (
    <div className="page home-modern">
      <Seo title="ParkSetu | Find parking that fits your routine" description="Find verified parking spaces in Bengaluru. Compare parking type, vehicle fit, facilities, availability and pricing on ParkSetu." path="/" />
      <section className="home-hero-new">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <span className="home-pill"><Sparkles size={14} /> A smarter way to park locally</span>
            <h1>Parking that<br /><span>feels simple.</span></h1>
            <p>Find verified private parking close to where you need to be. Compare the space, see the essentials, then connect when you're ready.</p>

            <div className="home-search-panel">
              <div className="home-search-field"><MapPin size={20}/><div><small>Where are you parking?</small><strong>Bengaluru</strong></div></div>
              <div className="home-search-field date"><Clock3 size={20}/><div><small>When?</small><strong>Choose date</strong></div></div>
              <Link className="btn btn-primary home-search-button" to="/search"><Search size={18}/> Search</Link>
            </div>

            <div className="home-trust-row">
              <span><ShieldCheck size={15}/> Verified spaces</span>
              <span><CheckCircle2 size={15}/> Clear pricing</span>
              <span><MapPin size={15}/> Local discovery</span>
            </div>
          </div>

          <div className="home-map-card" aria-label="Parking discovery preview">
            <div className="home-map-top"><span><i/> Live discovery</span><b>12 spaces nearby</b></div>
            <div className="home-map-surface">
              <div className="road road-a"/><div className="road road-b"/><div className="road road-c"/>
              <div className="map-dot you"><span/><b>You</b></div>
              <div className="map-pin-shape pin-1"><Navigation size={20}/></div>
              <div className="map-pin-shape pin-2 green"><Navigation size={20}/></div>
              <div className="map-pin-shape pin-3"><Navigation size={20}/></div>
              <div className="home-map-price"><b>Verified parking</b><span>From ₹1,800 / month</span></div>
            </div>
            <div className="home-map-footer"><span>Built around trust</span><span>Verification status is visible before you connect.</span><Link to="/search">Explore map <ArrowRight size={13}/></Link></div>
          </div>
        </div>
      </section>

      <section className="home-fit-section">
        <div className="container">
          <span className="eyebrow">FIND YOUR FIT</span>
          <h2>Search the way you think.</h2>
          <p>Start broad, then narrow down by vehicle, parking style, price and verification.</p>
          <div className="home-fit-grid">
            <Link to="/search?vehicle=Car" className="fit-card"><span className="fit-icon"><CarFront/></span><div><small>FOR CARS</small><b>Covered & open spaces</b><span>Search by routine, locality and parking type.</span></div><ArrowRight/></Link>
            <Link to="/search?vehicle=Bike" className="fit-card"><span className="fit-icon bike"><Navigation/></span><div><small>FOR TWO-WHEELERS</small><b>Bike & scooter spaces</b><span>Quick parking near offices, homes and daily routes.</span></div><ArrowRight/></Link>
            <Link to="/search?premium=1" className="fit-card premium"><span className="fit-icon premium"><Sparkles/></span><div><small>PREMIUM</small><b>Spaces with more comfort</b><span>Prioritize verified spaces with selected facilities.</span></div><ArrowRight/></Link>
          </div>
        </div>
      </section>

      <section className="home-featured-section">
        <div className="container">
          <div className="home-section-head"><div><span className="eyebrow">POPULAR NEARBY</span><h2>Parking people can trust.</h2></div><Link to="/search">View all <ArrowRight size={15}/></Link></div>
          <div className="home-featured-grid">{featured.map((space) => <Link key={space.id} to={`/parking/${space.id}`} className="home-space-card"><div className="home-space-image">{space.photos?.[0] ? <img src={space.photos[0]} alt={`${space.name} parking`} /> : <div className="home-space-icon"><CarFront size={34}/></div>}{space.premium && <span className="home-premium-badge"><Sparkles size={12}/> Premium</span>}</div><div className="home-space-body"><div className="home-verified"><CheckCircle2 size={12}/> Verified</div><h3>{space.name}</h3><p><MapPin size={13}/> {space.area} · {space.distance} km</p><div className="home-space-bottom"><b>₹{space.price.toLocaleString("en-IN")}</b><span>/ {space.availability.toLowerCase()}</span></div></div></Link>)}</div>
        </div>
      </section>

      <RecentViewed />

      <section className="home-list-strip"><div className="container home-list-strip-inner"><div><span className="eyebrow">HAVE UNUSED SPACE?</span><h2>Turn an empty spot into a useful local listing.</h2><p>List your parking space, complete the details and request verification.</p></div><Link to="/list-your-space" className="btn btn-primary">List your space <ArrowRight size={17}/></Link></div></section>
    </div>
  );
}
