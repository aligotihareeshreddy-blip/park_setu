import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Bike,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  IndianRupee,
  LockKeyhole,
  MapPin,
  ParkingCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  WalletCards,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parkingTypes } from "../data/parkingData";
import { getVehicleSettings } from "../data/vehicleConfig";
import "./SimplePages.css";
import Seo from "../components/Seo";

const CITY = "Bengaluru";
const STATE = "Karnataka";
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

const vehicleOptions = [
  { value: "SUV", label: "SUV" },
  { value: "Hatchback", label: "Hatchback" },
  { value: "Sedan", label: "Sedan" },
  { value: "Compact SUV", label: "Compact SUV" },
  { value: "MUV", label: "MUV" },
  { value: "Luxury Car", label: "Luxury Car" },
  { value: "Bike", label: "Bike" },
  { value: "Scooter", label: "Scooter" },
];

const amenityOptions = [
  ["cctv", "CCTV"],
  ["security", "Security"],
  ["lighting", "Good lighting"],
  ["gated", "Gated entry"],
  ["easy-entry", "Easy entry"],
  ["ev", "EV charging"],
  ["24x7", "24/7 access"],
  ["helmet", "Helmet space"],
];

const eKycTypes = [
  "Aadhaar",
  "PAN",
  "Driving Licence",
  "Passport",
];

const initialForm = {
  name: "",
  propertyCategory: "",
  parkingType: "",
  vehicleTypes: [],
  covered: "",
  availability: "",
  availableFrom: "",
  availableUntil: "",
  weeklyPrice: "",
  dailyPrice: "",
  monthlyPrice: "",
  description: "",
  address: "",
  locality: "",
  city: CITY,
  state: STATE,
  pinCode: "",
  landmark: "",
  access: "",
  capacity: "",
  mobile: "",
  amenities: [],
  premium: "",
  preDeposit: "",
  preDepositAmount: "",
  photos: [],
  declaration: false,
  terms: false,
  ekycType: "",
  ekycNumber: "",
  ekycFile: null,
};

const propertyCategories = [
  "Residential",
  "Apartment",
  "Independent House",
  "Private Land",
  "Authorized Space",
];

const availabilityOptions = ["Daily", "Weekly", "Monthly"];

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("parksetuUser") || "null");
  } catch {
    return null;
  }
};

function IconForAmenity({ name }) {
  const common = { size: 17, strokeWidth: 2 };
  const icons = {
    cctv: <ShieldCheck {...common} />,
    security: <LockKeyhole {...common} />,
    lighting: <Sparkles {...common} />,
    gated: <ParkingCircle {...common} />,
    "easy-entry": <ChevronRight {...common} />,
    ev: <WalletCards {...common} />,
    "24x7": <Clock3 {...common} />,
    helmet: <CircleHelp {...common} />,
  };
  return icons[name] || <CheckCircle2 {...common} />;
}

export default function ListSpace() {
  const navigate = useNavigate();
  const current = getCurrentUser();
  const [vehicleSettings] = useState(getVehicleSettings);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const visibleVehicleOptions = useMemo(
    () => vehicleOptions.filter((item) => item.value !== "Bike" || vehicleSettings.bike),
    [vehicleSettings]
  );

  if (!current || current.role !== "owner") {
    return (
      <div className="page">
        <section className="simple-hero center">
          <div className="container">
            <span className="eyebrow">LISTER WORKSPACE</span>
            <h1>Sign in to publish a parking space.</h1>
            <p>Complete your space details, eKYC and verification request from one simple workspace.</p>
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Go to lister login <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
  };

  const toggleArrayValue = (key, value) => {
    const currentValues = form[key];
    update(key, currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value]);
  };

  const priceField = form.availability === "Daily" ? "dailyPrice" : form.availability === "Weekly" ? "weeklyPrice" : "monthlyPrice";
  const priceLabel = form.availability === "Daily" ? "Daily price" : form.availability === "Weekly" ? "Weekly price" : "Monthly price";

  const validateFieldsForStep = (targetStep) => {
    const next = {};
    const addRequired = (key, message) => {
      if (!String(form[key] ?? "").trim()) next[key] = message;
    };

    if (targetStep === 1) {
      addRequired("name", "Listing title is required.");
      addRequired("propertyCategory", "Property category is required.");
      addRequired("parkingType", "Parking type is required.");
      addRequired("covered", "Covered or Open is required.");
      addRequired("availability", "Availability is required.");
      addRequired("availableFrom", "Available from date is required.");
      addRequired("availableUntil", "Available until date is required.");
      addRequired("capacity", "Capacity is required.");
      addRequired("description", "Description is required.");
      if (!form.vehicleTypes.length) next.vehicleTypes = "Select at least one vehicle type.";
      if (form.description.trim().length < 20) next.description = "Description must be at least 20 characters.";
      if (form.availableUntil && form.availableFrom && form.availableUntil < form.availableFrom) next.availableUntil = "Available until must be on or after available from.";
    }

    if (targetStep === 2) {
      addRequired("locality", "Locality is required.");
      addRequired("pinCode", "PIN code is required.");
      addRequired("address", "Address is required.");
      addRequired("landmark", "Landmark is required.");
      addRequired("access", "Access is required.");
      addRequired("mobile", "Indian mobile number is required.");
      if (!/^\d{6}$/.test(form.pinCode)) next.pinCode = "Enter a valid 6-digit Indian PIN code.";
      if (!MOBILE_PATTERN.test(form.mobile)) next.mobile = "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }

    if (targetStep === 3) {
      if (!form.amenities.length) next.amenities = "Select at least one facility or feature.";
      if (!form.photos.length || form.photos.length < 2) next.photos = "Upload at least 2 parking photos.";
      if (!form[priceField] || Number(form[priceField]) <= 0) next[priceField] = `${priceLabel} is required and must be greater than 0.`;
      addRequired("premium", "Choose Premium or Normal listing type.");
      addRequired("preDeposit", "Choose whether a pre-deposit is required.");
      if (form.preDeposit === "Yes" && (!form.preDepositAmount || Number(form.preDepositAmount) <= 0)) next.preDepositAmount = "Enter a pre-deposit amount greater than 0.";
    }

    if (targetStep === 4) {
      addRequired("ekycType", "eKYC type is required.");
      addRequired("ekycNumber", "eKYC number is required.");
      const ekycPatterns = {
        Aadhaar: /^\d{12}$/,
        PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
        "Driving Licence": /^[A-Z0-9-]{8,20}$/,
        Passport: /^[A-Z0-9]{8}$/,
      };
      if (form.ekycType && form.ekycNumber && ekycPatterns[form.ekycType] && !ekycPatterns[form.ekycType].test(form.ekycNumber)) {
        next.ekycNumber = form.ekycType === "Aadhaar" ? "Aadhaar must contain exactly 12 digits." : form.ekycType === "PAN" ? "PAN must match the format ABCDE1234F." : form.ekycType === "Passport" ? "Passport number must contain 8 letters/numbers." : "Enter a valid driving licence number.";
      }
      if (!form.ekycFile) next.ekycFile = "Upload the selected eKYC document.";
      if (!form.declaration) next.declaration = "Confirm that you are authorized to list this space.";
      if (!form.terms) next.terms = "Accept the Terms & Conditions to continue.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep = (targetStep) => {
    if (targetStep <= step) { setStep(targetStep); return; }
    if (validateFieldsForStep(step)) setStep(targetStep);
  };

  const availabilityCopy = {
    Daily: { from: "Available date from", until: "Available date until", help: "Choose the first and last day this space can be used." },
    Weekly: { from: "Available week from", until: "Available week until", help: "Choose the first and last week covered by this listing." },
    Monthly: { from: "Available month from", until: "Available month until", help: "Choose the first and last month covered by this listing." },
  };
  const dateCopy = availabilityCopy[form.availability] || { from: "Available from", until: "Available until", help: "Select availability first to set the listing date range." };

  const validateAll = () => {
    const valid = [1, 2, 3, 4].every((number) => {
      const stepValid = validateFieldsForStep(number);
      return stepValid;
    });
    return valid;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validateAll()) return;

    const listing = {
      ...form,
      city: CITY,
      state: STATE,
      price: Number(form[priceField]),
      pricePeriod: form.availability,
      premium: form.premium === "Premium",
      status: "Pending verification",
      createdAt: new Date().toISOString(),
      id: `listing-${Date.now()}`,
    };
    localStorage.setItem("parksetuListing", JSON.stringify(listing));
    setSubmitted(true);
  };

  const fieldError = (key) => errors[key] && <small className="form-error">{errors[key]}</small>;

  return (
    <div className="page">
      <Seo title="List Your Parking Space | ParkSetu" description="List your private parking space in Bengaluru on ParkSetu. Add availability, facilities, pricing, deposit preferences and complete eKYC before verification." path="/list-your-space" />
      <section className="lister-hero">
        <div className="container">
          <span className="eyebrow">LISTER WORKSPACE</span>
          <div className="lister-hero-row">
            <div>
              <h1>Space details</h1>
              <p>Add your parking space once. We’ll guide you through the details, eKYC and verification request.</p>
            </div>
            <div className="lister-trust"><ShieldCheck size={17} /> Secure & verification-ready</div>
          </div>
          <div className="workspace-steps" aria-label="Listing progress">
            {["Space", "Location", "Facilities & pricing", "eKYC & review"].map((label, index) => {
              const number = index + 1;
              return (
                <button type="button" key={label} className={step >= number ? "active" : ""} onClick={() => validateStep(number)}>
                  <b>{label}</b>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section lister-section">
        <div className="container two-column lister-layout">
          <div>
            {submitted ? (
              <div className="success-box card">
                <CheckCircle2 size={34} />
                <div>
                  <h3>Verification request submitted</h3>
                  <p>Your parking space has been saved and sent for verification. You can track the status from your lister dashboard.</p>
                  <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
                    Open lister dashboard <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <form className="form-card card live-list-form" onSubmit={submit} noValidate>
                {step === 1 && (
                  <div className="form-step">
                    <div className="form-section-title"><div><h2>Tell us about the space</h2><p>Every field is required so seekers get complete information.</p></div></div>

                    <div className="form-field-group">
                      <label>Listing title*<input name="name" className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Premium covered parking near Forum Mall" />{fieldError("name")}</label>
                      <label>Property category *<select name="propertyCategory" className="select" value={form.propertyCategory} onChange={(e) => update("propertyCategory", e.target.value)}><option value="">Select property category</option>{propertyCategories.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("propertyCategory")}</label>
                    </div>

                    <label>Parking type *<select name="parkingType" className="select" value={form.parkingType} onChange={(e) => update("parkingType", e.target.value)}><option value="">Select parking type</option>{parkingTypes.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("parkingType")}</label>

                    <div>
                      <div className="field-label">Vehicle types *</div>
                      <div className="icon-select-grid">{visibleVehicleOptions.map((item) => {
                        const selected = form.vehicleTypes.includes(item.value);
                        const Icon = item.value === "Bike" || item.value === "Scooter" ? Bike : CarFront;
                        return <button type="button" key={item.value} className={selected ? "icon-choice active" : "icon-choice"} onClick={() => toggleArrayValue("vehicleTypes", item.value)}><Icon size={18}/><span>{item.label}</span>{selected && <CheckCircle2 size={14}/>}</button>;
                      })}</div>
                      {fieldError("vehicleTypes")}
                    </div>

                    <div className="form-field-group">
                      <label>Covered / Open *<select name="covered" className="select" value={form.covered} onChange={(e) => update("covered", e.target.value)}><option value="">Select</option><option>Covered</option><option>Open</option></select>{fieldError("covered")}</label>
                      <label>Availability *<select name="availability" className="select" value={form.availability} onChange={(e) => update("availability", e.target.value)}><option value="">Select</option>{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("availability")}</label>
                    </div>

                    {form.availability && <div className="availability-range-note"><Clock3 size={16}/><span>{dateCopy.help}</span></div>}
                    <div className="form-field-group">
                      <label>{dateCopy.from} *<input name="availableFrom" className="input" type="date" value={form.availableFrom} onChange={(e) => update("availableFrom", e.target.value)} min={new Date().toISOString().slice(0, 10)} />{fieldError("availableFrom")}</label>
                      <label>{dateCopy.until} *<input name="availableUntil" className="input" type="date" value={form.availableUntil} onChange={(e) => update("availableUntil", e.target.value)} min={form.availableFrom || undefined} />{fieldError("availableUntil")}</label>
                    </div>

                    <label>Parking space capacity *<select name="capacity" className="select" value={form.capacity} onChange={(e) => update("capacity", e.target.value)}><option value="">Select capacity</option>{Array.from({ length: 8 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} {value === 1 ? "space" : "spaces"}</option>)}</select>{fieldError("capacity")}</label>

                    <label>Space description *<textarea name="description" className="input textarea" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the entrance, surroundings, vehicle fit, access and anything a seeker should know." />{fieldError("description")}</label>

                    <div className="step-actions"><button type="button" className="btn btn-primary" onClick={() => { if (validateFieldsForStep(1)) setStep(2); }}>Continue to location <ArrowRight size={17}/></button></div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step">
                    <div className="form-section-title"><div><h2>Location & access</h2><p>City and state are fixed for this ParkSetu launch workspace.</p></div></div>
                    <div className="form-field-group">
                      <label>City *<input name="city" className="input input-disabled" value={CITY} disabled readOnly /></label>
                      <label>State *<input name="state" className="input input-disabled" value={STATE} disabled readOnly /></label>
                    </div>
                    <div className="fixed-location-note"><MapPin size={17}/><span>ParkSetu launch service area is currently <b>Bengaluru, Karnataka</b>. These two fields are fixed and cannot be changed here.</span></div>
                    <div className="form-field-group">
                      <label>Locality *<input name="locality" className="input" value={form.locality} onChange={(e) => update("locality", e.target.value)} placeholder="e.g. Koramangala" />{fieldError("locality")}</label>
                      <label>PIN code *<input name="pinCode" className="input" inputMode="numeric" maxLength="6" value={form.pinCode} onChange={(e) => update("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="560034" />{fieldError("pinCode")}</label>
                    </div>
                    <label>Full parking address *<input name="address" className="input" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Apartment / street / building / entry details" />{fieldError("address")}</label>
                    <label>Landmark *<input name="landmark" className="input" value={form.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="e.g. Near Forum Mall" />{fieldError("landmark")}</label>
                    <div className="form-field-group">
                      <label>Access *<select name="access" className="select" value={form.access} onChange={(e) => update("access", e.target.value)}><option value="">Select access</option><option>24/7</option><option>Daytime</option><option>Night</option><option>Custom</option></select>{fieldError("access")}</label>
                      <label>Indian mobile number *<input name="mobile" className="input" inputMode="numeric" maxLength="10" value={form.mobile} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" />{fieldError("mobile")}</label>
                    </div>
                    <div className="field-help-box"><ShieldCheck size={17}/><div><b>Indian mobile validation</b><span>Enter exactly 10 digits. Valid numbers start with 6, 7, 8 or 9.</span></div></div>
                    <div className="step-actions"><button type="button" className="btn btn-light" onClick={() => setStep(1)}>Back</button><button type="button" className="btn btn-primary" onClick={() => { if (validateFieldsForStep(2)) setStep(3); }}>Continue to facilities <ArrowRight size={17}/></button></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-step">
                    <div className="form-section-title"><div><h2>Facilities, photos & pricing</h2><p>Show seekers what makes your space convenient and trustworthy.</p></div></div>
                    <div>
                      <div className="field-label">Facilities & features *</div>
                      <div className="amenity-grid">{amenityOptions.map(([value, label]) => {
                        const active = form.amenities.includes(value);
                        return <button type="button" className={active ? "amenity-choice active" : "amenity-choice"} key={value} onClick={() => toggleArrayValue("amenities", value)}><IconForAmenity name={value}/><span>{label}</span>{active && <CheckCircle2 size={14}/>}</button>;
                      })}</div>
                      {fieldError("amenities")}
                    </div>

                    {form.availability && <label><span>{priceLabel} *</span><div className="amount-input"><IndianRupee size={17}/><input name={priceField} className="input" type="number" min="1" step="1" value={form[priceField]} onChange={(e) => update(priceField, e.target.value)} placeholder="Enter amount" /></div>{fieldError(priceField)}</label>}

                    <div className="form-field-group">
                      <div><div className="field-label">Listing type *</div><div className="listing-type-choice"><button type="button" className={form.premium === "Premium" ? "premium-toggle active" : "premium-toggle"} onClick={() => update("premium", "Premium")}><span><Sparkles size={16}/> Premium</span><b>Premium</b></button><button type="button" className={form.premium === "Normal" ? "premium-toggle normal active" : "premium-toggle normal"} onClick={() => update("premium", "Normal")}><span>Normal</span><b>Standard</b></button></div>{fieldError("premium")}</div>
                      <label>Pre-deposit required *<select name="preDeposit" className="select" value={form.preDeposit} onChange={(e) => update("preDeposit", e.target.value)}><option value="">Select</option><option>Yes</option><option>No</option></select>{fieldError("preDeposit")}</label>
                    </div>
                    {form.preDeposit === "Yes" && <label>Pre-deposit amount *<div className="amount-input"><IndianRupee size={17}/><input name="preDepositAmount" className="input" type="number" min="1" step="1" value={form.preDepositAmount} onChange={(e) => update("preDepositAmount", e.target.value)} placeholder="Enter deposit amount" /></div>{fieldError("preDepositAmount")}</label>}
                    {form.preDeposit === "No" && <div className="info-card"><WalletCards size={18}/><div><b>No pre-deposit</b><span>Seekers will see that this listing does not request a pre-deposit from them.</span></div></div>}

                    <label>Parking photos *<input name="photos" className="file-input" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(e) => update("photos", Array.from(e.target.files || []))} /><small className="field-help">Upload at least 2 clear photos of the actual parking space.</small>{fieldError("photos")}</label>
                    {form.photos.length > 0 && <div className="file-preview-row">{form.photos.map((file) => <span key={`${file.name}-${file.lastModified}`}><FileCheck2 size={14}/>{file.name}<X size={13}/></span>)}</div>}

                    <div className="step-actions"><button type="button" className="btn btn-light" onClick={() => setStep(2)}>Back</button><button type="button" className="btn btn-primary" onClick={() => { if (validateFieldsForStep(3)) setStep(4); }}>Continue to eKYC <ArrowRight size={17}/></button></div>
                  </div>
                )}

                {step === 4 && (
                  <div className="form-step">
                    <div className="form-section-title"><div><h2>eKYC & review</h2><p>Complete identity verification details before requesting physical verification.</p></div></div>
                    <div className="field-help-box"><LockKeyhole size={17}/><div><b>Your identity data is protected</b><span>Only the required eKYC information should be collected. Verification status is not entered manually here.</span></div></div>
                    <div className="form-field-group">
                      <label>eKYC document type *<select name="ekycType" className="select" value={form.ekycType} onChange={(e) => update("ekycType", e.target.value)}><option value="">Select document type</option>{eKycTypes.map((item) => <option key={item}>{item}</option>)}</select>{fieldError("ekycType")}</label>
                      <label>eKYC document number *<input name="ekycNumber" className="input" value={form.ekycNumber} onChange={(e) => update("ekycNumber", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder={form.ekycType === "Aadhaar" ? "12-digit Aadhaar" : form.ekycType === "PAN" ? "ABCDE1234F" : form.ekycType === "Passport" ? "A1234567" : "DL number"} />{fieldError("ekycNumber")}</label>
                    </div>
                    <label>Upload eKYC document *<input name="ekycFile" className="file-input" type="file" accept="image/png,image/jpeg,application/pdf" onChange={(e) => update("ekycFile", e.target.files?.[0] || null)} />{fieldError("ekycFile")}</label>
                    {form.ekycFile && <div className="uploaded-file"><Upload size={16}/><span>{form.ekycFile.name}</span><b>Ready</b></div>}

                    <label className="check-box-row"><input type="checkbox" checked={form.declaration} onChange={(e) => update("declaration", e.target.checked)} /><span>I confirm that I am authorized to list this parking space and that the information provided is accurate.</span></label>
                    {fieldError("declaration")}
                    <label className="check-box-row terms-row"><input type="checkbox" checked={form.terms} onChange={(e) => update("terms", e.target.checked)} /><span>I accept the <button type="button" onClick={(e) => e.preventDefault()}>ParkSetu Terms & Conditions</button> and verification guidelines.</span></label>
                    {fieldError("terms")}

                    <div className="submit-readiness"><div><ShieldCheck size={18}/><div><b>Ready to request verification?</b><span>The Submit for verification button activates only after you accept the Terms & Conditions.</span></div></div><span className={form.terms ? "ready" : "not-ready"}>{form.terms ? "Ready" : "Accept terms"}</span></div>

                    <div className="step-actions"><button type="button" className="btn btn-light" onClick={() => setStep(3)}>Back</button><button className="btn btn-primary" type="submit" disabled={!form.terms}><CheckCircle2 size={17}/> Submit for verification</button></div>
                  </div>
                )}
              </form>
            )}
          </div>

          <aside className="benefit-stack lister-side-stack">
            <div className="side-summary card"><span className="eyebrow">YOUR SPACE</span><h3>Build trust before you connect.</h3><p>Complete details help seekers understand your space and make the verification visit smoother.</p><div className="space-count-note">Up to 8 parking spaces can be listed for this space.</div><div className="side-progress"><span style={{ width: `${step * 25}%` }}/></div><b>{step === 4 ? "Ready for verification" : "Keep going — your space is taking shape"}</b></div>
            <div className="benefit card"><ShieldCheck/><div><h3>Verification-ready</h3><p>Location and listing details can be reviewed before your space is published as verified.</p></div></div>
            <div className="benefit card"><IndianRupee/><div><h3>Clear pricing</h3><p>Choose daily, weekly or monthly availability and enter the amount without a pre-filled zero.</p></div></div>
            <div className="benefit card"><LockKeyhole/><div><h3>Protected eKYC</h3><p>Choose a supported identity document and upload only the required proof.</p></div></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
