import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { connectPackages } from "../data/parkingData";
import "./SimplePages.css";

export default function Connect() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page">
      <section className="simple-hero">
        <div className="container">
          <span className="eyebrow">CONNECT PACKAGES</span>
          <h1>Find a relevant space, then unlock the connection.</h1>
          <p>Discovery can remain free. Choose a connection package when you want to connect with a relevant parking space owner.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="connect-note card">
            <ShieldCheck /><div><b>Connection packages</b><p>Choose the access level that fits your parking search.</p></div>
          </div>

          <div className="package-grid">
            {connectPackages.map((item, index) => (
              <div className={`package-card card ${index === 2 ? "featured" : ""}`} key={item.id}>
                {index === 2 && <span className="package-badge"><Sparkles size={13} /> Premium access</span>}
                <span className="package-number">0{index + 1}</span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <div className="package-connects"><b>{item.connects}</b><span>connections</span></div>
                <div className="package-access">{item.access}</div>
                <div className="package-price">{item.price}</div>
                <button className="btn btn-primary" onClick={() => setSelected(item.id)}>
                  {selected === item.id ? "Selected" : "Select package"} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="connect-flow">
            <div><Check /> Free local discovery</div>
            <ArrowRight />
            <div><Check /> Choose a relevant space</div>
            <ArrowRight />
            <div><Check /> Connect package unlocks connection</div>
            <ArrowRight />
            <div><Check /> Owner ↔ seeker direct arrangement</div>
          </div>

          <Link to="/search" className="btn btn-light">Back to parking search</Link>
        </div>
      </section>
    </div>
  );
}
