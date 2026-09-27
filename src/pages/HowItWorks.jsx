import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Link2,
  MapPinCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import "./SimplePages.css";

const steps = [
  {
    title: "List",
    icon: ClipboardList,
    text: "Owner submits space + KYC",
  },
  {
    title: "Verify",
    icon: ShieldCheck,
    text: "Team verifies location",
  },
  {
    title: "Publish",
    icon: CheckCircle2,
    text: "Verified listing goes live",
  },
  {
    title: "Search",
    icon: Search,
    text: "Seeker searches locally",
  },
  {
    title: "Choose",
    icon: MapPinCheck,
    text: "Seeker finds a relevant space",
  },
  {
    title: "Connect",
    icon: Link2,
    text: "Connect package unlocks connection",
  },
  {
    title: "Direct",
    icon: ArrowRight,
    text: "Owner ↔ seeker; platform steps away",
  },
];

export default function HowItWorks() {
  return (
    <div className="page">
      <section className="simple-hero">
        <div className="container">
          <span className="eyebrow">HOW IT WORKS</span>
          <h1>From unused space to a direct connection.</h1>
          <p>
            The product flow follows the marketplace model while adding car,
            bike and premium parking choices.
          </p>
        </div>
      </section>

      <section className="section how-it-works-section">
        <div className="container">

          <div className="steps-flow">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div className="step-seven card" key={step.title}>
                  <div className="step-icon">
                    <Icon />
                  </div>

                  <h2>{step.title}</h2>

                  <p>{step.text}</p>
                </div>
              );
            })}
          </div>

          <div className="marketplace-boundary">
            <div className="boundary-box">
              <Sparkles />

              <div>
                <b>ParkSetu owns discovery and connection.</b>

                <p>
                  The private parking arrangement remains directly between
                  the lister and seeker. ParkSetu focuses on discovery and
                  connection.
                </p>
              </div>
            </div>

            <Link to="/search" className="btn btn-primary find-parking-btn">
              Find parking
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}