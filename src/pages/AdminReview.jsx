import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CarFront,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { parkingSpaces } from "../data/parkingData";
import "./AdminReview.css";

const readListing = () => {
  try {
    return JSON.parse(localStorage.getItem("parksetuListing") || "null");
  } catch {
    return null;
  }
};

const readReviewStatus = () => {
  try {
    return JSON.parse(localStorage.getItem("parksetuAdminReviewStatuses") || "{}");
  } catch {
    return {};
  }
};

export default function AdminReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentListing = readListing();
  const reviewStatuses = readReviewStatus();
  const staticSpace = parkingSpaces.find((space) => space.id === id);

  const space = useMemo(() => {
    if (currentListing && currentListing.id === id) {
      return {
        id: currentListing.id,
        name: currentListing.name,
        area: currentListing.location,
        city: currentListing.city || "Bengaluru",
        vehicleType: currentListing.vehicle,
        parkingType: currentListing.parkingType,
        premium: currentListing.premium,
        price: currentListing.price,
        priceLabel: "per month",
        rating: null,
        distance: null,
        verified: false,
        access: currentListing.access,
        availability: currentListing.availability,
        capacity: currentListing.capacity,
        features: currentListing.features || [],
        description: currentListing.details,
        address: currentListing.address,
        suitableFor: currentListing.vehicle === "Car" ? "Cars, SUVs" : "Bikes, Scooters",
        nearby: [],
        ownerName: currentListing.owner || "Space Lister",
        ownerMobile: currentListing.mobile || "Not provided",
        ownerEmail: currentListing.ownerEmail || "Not provided",
        status: reviewStatuses[id] || currentListing.status || "Pending verification",
        source: "lister",
      };
    }

    if (!staticSpace) return null;

    return {
      ...staticSpace,
      ownerName: staticSpace.ownerName || "Verified Space Lister",
      ownerMobile: staticSpace.ownerMobile || "+91 90000 00000",
      ownerEmail: staticSpace.ownerEmail || "lister@parksetu.com",
      status: reviewStatuses[id] || (staticSpace.verified ? "Verified" : "Pending verification"),
      source: "marketplace",
    };
  }, [currentListing, id, reviewStatuses, staticSpace]);

  const [status, setStatus] = useState(space?.status || "Pending verification");
  const [message, setMessage] = useState("");

  if (!space) {
    return (
      <div className="page">
        <section className="section">
          <div className="container admin-review-empty">
            <XCircle size={42} />
            <h1>Parking space not found</h1>
            <p>The listing you are trying to review is no longer available.</p>
            <Link className="btn btn-primary" to="/dashboard">Back to admin dashboard</Link>
          </div>
        </section>
      </div>
    );
  }

  const updateStatus = (nextStatus) => {
    const next = { ...reviewStatuses, [space.id]: nextStatus };
    localStorage.setItem("parksetuAdminReviewStatuses", JSON.stringify(next));
    if (currentListing && currentListing.id === space.id) {
      localStorage.setItem("parksetuListing", JSON.stringify({ ...currentListing, status: nextStatus }));
    }
    setStatus(nextStatus);
    setMessage(`Listing marked as ${nextStatus.toLowerCase()}.`);
    window.dispatchEvent(new Event("parksetuListingStatusChanged"));
  };

  return (
    <div className="page">
      <section className="section admin-review-page">
        <div className="container">
          <div className="admin-review-topbar">
            <button className="back-link" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} /> Back to dashboard
            </button>
            <span className={`review-status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
              <Clock3 size={14} /> {status}
            </span>
          </div>

          <div className="admin-review-heading">
            <div>
              <span className="eyebrow">LISTING REVIEW</span>
              <h1>{space.name}</h1>
              <p><MapPin size={15} /> {space.address || `${space.area}, ${space.city}`}</p>
            </div>
            {space.premium && <span className="review-premium">Premium property</span>}
          </div>

          <div className="admin-review-grid">
            <main>
              <section className="review-card">
                <div className="review-card-head">
                  <div>
                    <span className="eyebrow">SPACE DETAILS</span>
                    <h2>Parking space overview</h2>
                  </div>
                  {space.verified && <span className="verified-pill"><BadgeCheck size={14} /> Verified</span>}
                </div>

                <div className="review-property-grid">
                  <div><span>Vehicle</span><b><CarFront size={15} /> {space.vehicleType}</b></div>
                  <div><span>Parking type</span><b>{space.parkingType}</b></div>
                  <div><span>Monthly price</span><b>₹{Number(space.price || 0).toLocaleString("en-IN")} / month</b></div>
                  <div><span>Capacity</span><b>{space.capacity || "Not provided"}</b></div>
                  <div><span>Access</span><b>{space.access || "Not provided"}</b></div>
                  <div><span>Availability</span><b>{space.availability || "Monthly"}</b></div>
                </div>

                <div className="review-description">
                  <h3>Property description</h3>
                  <p>{space.description || "The lister has not added an additional description."}</p>
                </div>

                <div className="review-location-box">
                  <MapPin size={19} />
                  <div>
                    <b>Location submitted by lister</b>
                    <span>{space.address || `${space.area}, ${space.city}`}</span>
                  </div>
                </div>

                <div className="review-checklist">
                  <h3>Review checklist</h3>
                  <div><CheckCircle2 size={16} /> Parking type is specified</div>
                  <div><CheckCircle2 size={16} /> Vehicle type is specified</div>
                  <div><CheckCircle2 size={16} /> Monthly price is specified</div>
                  <div><CheckCircle2 size={16} /> Address is available for review</div>
                  <div><ShieldCheck size={16} /> Verify the physical location before approving</div>
                </div>
              </section>

              <section className="review-card">
                <div className="review-card-head">
                  <div>
                    <span className="eyebrow">ADMIN DECISION</span>
                    <h2>Listing verification</h2>
                  </div>
                  <FileCheck2 size={24} />
                </div>

                <div className="review-actions">
                  <button className="approve-button" onClick={() => updateStatus("Verified")}>
                    <CheckCircle2 size={17} /> Approve listing
                  </button>
                  <button className="changes-button" onClick={() => updateStatus("Changes requested")}>
                    <Clock3 size={17} /> Request changes
                  </button>
                  <button className="reject-button" onClick={() => updateStatus("Rejected")}>
                    <XCircle size={17} /> Reject listing
                  </button>
                </div>

                {message && <div className="review-message"><CheckCircle2 size={15} /> {message}</div>}
              </section>
            </main>

            <aside>
              <section className="review-card lister-card">
                <div className="lister-avatar"><UserRound size={25} /></div>
                <span className="eyebrow">LISTER DETAILS</span>
                <h2>{space.ownerName}</h2>
                <p className="lister-role">Space owner / lister</p>

                <div className="lister-contact">
                  <div><Phone size={15} /><span>{space.ownerMobile}</span></div>
                  <div><Mail size={15} /><span>{space.ownerEmail}</span></div>
                </div>

                <div className="lister-verification">
                  <ShieldCheck size={17} />
                  <div><b>Owner verification</b><span>Review KYC and ownership documents before approval.</span></div>
                </div>
              </section>

              <section className="review-card admin-next-card">
                <Building2 size={22} />
                <h3>Before approving</h3>
                <ul>
                  <li>Confirm the parking location.</li>
                  <li>Confirm the lister has the right to provide the space.</li>
                  <li>Check photos and physical parking conditions.</li>
                  <li>Confirm the monthly price and availability.</li>
                  <li>Approve only after required verification is complete.</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
