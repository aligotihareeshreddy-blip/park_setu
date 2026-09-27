import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Filter,
  Gauge,
  Heart,
  HelpCircle,
  History,
  Home,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";
import { parkingSpaces } from "../data/parkingData";
import "./Workspace.css";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("parksetuUser") || "null");
  } catch {
    return null;
  }
};

const navByRole = {
  user: [
    ["overview", "Overview", Home],
    ["search", "Find Parking", Search],
    ["connections", "Connections", MessageCircle],
    ["saved", "Saved Spaces", Heart],
    ["payments", "Payments", WalletCards],
    ["notifications", "Notifications", Bell],
    ["support", "Support", HelpCircle],
    ["account", "My Account", Settings2],
  ],
  owner: [
    ["overview", "Overview", Home],
    ["listings", "My Listings", Building2],
    ["verification", "Verification", ClipboardCheck],
    ["analytics", "Analytics", Activity],
    ["payments", "Payments", WalletCards],
    ["notifications", "Notifications", Bell],
    ["support", "Support", HelpCircle],
    ["account", "My Account", Settings2],
  ],
  admin: [
    ["overview", "Overview", Home],
    ["users", "Users", Users],
    ["verification", "Verification Queue", ClipboardCheck],
    ["listings", "Listings", Building2],
    ["packages", "Packages & Pricing", Package],
    ["payments", "Transactions", WalletCards],
    ["coupons", "Coupons", Sparkles],
    ["reports", "Reports & BI", Gauge],
    ["rbac", "Roles & Permissions", ShieldCheck],
    ["notifications", "Communication", Bell],
    ["support", "Support", HelpCircle],
    ["audit", "Audit Log", History],
    ["account", "System Settings", Settings2],
  ],
};

const statData = {
  user: [
    ["2", "Connects remaining", CreditCard, "2 of 3 free launch connects"],
    ["6", "Saved spaces", Heart, "3 recently active"],
    ["4", "Recent visits", History, "Across Bengaluru"],
    ["1", "Active connection", MessageCircle, "Contact unlocked"],
  ],
  owner: [
    ["2", "Total listings", Building2, "1 free launch listing"],
    ["1", "Published", BadgeCheck, "Verified and active"],
    ["7.8k", "Views", Activity, "This month"],
    ["18", "Connections", MessageCircle, "6 successful"],
  ],
  admin: [
    ["248", "Active users", Users, "+12% this month"],
    ["86", "Active listings", Building2, "72 verified"],
    ["14", "Verification queue", ClipboardCheck, "5 due today"],
    ["₹1.82L", "Platform revenue", CircleDollarSign, "This month"],
  ],
};

function Status({ children, tone = "green" }) {
  return <span className={`ws-status ${tone}`}><span />{children}</span>;
}

function MetricCards({ role }) {
  return <div className="ws-metrics">{statData[role].map(([value, label, Icon, hint]) => <div className="ws-metric" key={label}>
    <div className="ws-metric-icon"><Icon size={18} /></div>
    <div><strong>{value}</strong><span>{label}</span><small>{hint}</small></div>
  </div>)}</div>;
}

function Overview({ role, setSection }) {
  if (role === "admin") return <AdminOverview setSection={setSection} />;
  if (role === "owner") return <ListerOverview setSection={setSection} />;
  return <SearcherOverview setSection={setSection} />;
}

function SearcherOverview({ setSection }) {
  return <>
    <div className="ws-hero-card">
      <div><span className="eyebrow">SEARCHER WORKSPACE</span><h2>Good afternoon. Find a space that works for your routine.</h2><p>Public search stays simple, while protected contact and precise location details unlock after authentication and Connect validation.</p><div className="ws-actions"><button className="ws-primary" onClick={() => setSection("search")}><Search size={17}/> Find parking</button><button className="ws-secondary" onClick={() => setSection("connections")}><MessageCircle size={17}/> My connections</button></div></div>
      <div className="ws-hero-art"><MapPin size={42}/><b>Verified local parking</b><span>Approximate location before connect</span></div>
    </div>
    <MetricCards role="user" />
    <div className="ws-grid-2">
      <Panel title="Continue your search" eyebrow="RECENT ACTIVITY" action="View all" onAction={() => setSection("search")}>
        <div className="ws-list-item"><div className="ws-avatar"><CarFront size={18}/></div><div><b>Indiranagar Metro Parking</b><span>Indiranagar · Covered · ₹3,500/month</span></div><Status>Verified</Status><ChevronRight size={17}/></div>
        <div className="ws-list-item"><div className="ws-avatar"><CarFront size={18}/></div><div><b>Koramangala Private Slot</b><span>Koramangala · Open · ₹2,800/month</span></div><Status>Verified</Status><ChevronRight size={17}/></div>
      </Panel>
      <Panel title="Connect balance" eyebrow="ENTITLEMENT">
        <div className="connect-balance"><div className="connect-ring"><strong>2</strong><span>left</span></div><div><b>Launch Connects</b><p>Use a Connect to unlock a relevant lister contact. Additional packages can be purchased when the free entitlement is exhausted.</p><button className="text-action" onClick={() => setSection("connections")}>Manage connects <ArrowRight size={15}/></button></div></div>
      </Panel>
    </div>
  </>;
}

function ListerOverview({ setSection }) {
  return <>
    <div className="ws-hero-card lister">
      <div><span className="eyebrow">LISTER WORKSPACE</span><h2>Manage your parking supply from one place.</h2><p>Create listings, upload evidence, track verification, see marketplace performance and manage applicable listing charges.</p><div className="ws-actions"><button className="ws-primary" onClick={() => setSection("listings")}><Plus size={17}/> Add listing</button><button className="ws-secondary" onClick={() => setSection("analytics")}><Activity size={17}/> View analytics</button></div></div>
      <div className="ws-hero-art"><Building2 size={42}/><b>1st listing free</b><span>Second and later listings follow configured pricing</span></div>
    </div>
    <MetricCards role="owner" />
    <div className="ws-grid-2">
      <Panel title="Listing health" eyebrow="PERFORMANCE">
        <div className="health-row"><span>Verification readiness</span><b>92%</b></div><div className="progress"><i style={{width:"92%"}} /></div>
        <div className="health-row"><span>Profile completeness</span><b>84%</b></div><div className="progress"><i style={{width:"84%"}} /></div>
        <div className="health-row"><span>Response activity</span><b>76%</b></div><div className="progress"><i style={{width:"76%"}} /></div>
      </Panel>
      <Panel title="Latest listing activity" eyebrow="OPERATIONS">
        <div className="timeline"><Timeline icon={ClipboardCheck} title="Verification scheduled" meta="Today · 11:30 AM" /><Timeline icon={EyeIcon} title="Listing received 18 views" meta="Today · 10:20 AM" /><Timeline icon={MessageCircle} title="New connection created" meta="Yesterday · 6:42 PM" /></div>
      </Panel>
    </div>
  </>;
}

function AdminOverview({ setSection }) {
  return <>
    <div className="ws-hero-card admin">
      <div><span className="eyebrow">SUPER ADMIN CONTROL CENTRE</span><h2>Run ParkSetu operations, trust and marketplace economics.</h2><p>Monitor supply, demand, verification backlog, payments, Connect usage, exceptions, permissions and operational alerts.</p><div className="ws-actions"><button className="ws-primary" onClick={() => setSection("verification")}><ClipboardCheck size={17}/> Open verification queue</button><button className="ws-secondary" onClick={() => setSection("reports")}><Gauge size={17}/> View business KPIs</button></div></div>
      <div className="admin-kpi-art"><span>₹1.82L</span><small>Revenue this month</small><div><b>94.6%</b><small>payment success</small></div></div>
    </div>
    <MetricCards role="admin" />
    <div className="ws-grid-3">
      <MiniKpi title="Supply" value="86" detail="72 verified listings" icon={Building2} onClick={() => setSection("listings")} />
      <MiniKpi title="Demand" value="1,426" detail="Searches this week" icon={Search} onClick={() => setSection("reports")} />
      <MiniKpi title="Trust" value="93%" detail="Verification pass rate" icon={ShieldCheck} onClick={() => setSection("verification")} />
    </div>
    <Panel title="Operational alerts" eyebrow="ACTION REQUIRED">
      <div className="alert-grid"><Alert title="5 verification visits due today" meta="Assign or reassign engineers" icon={ClipboardCheck} tone="warning" /><Alert title="3 payment exceptions" meta="Provider success with delayed callback" icon={CircleDollarSign} tone="danger" /><Alert title="2 suspicious GPS attempts" meta="Review before publishing" icon={MapPin} tone="purple" /></div>
    </Panel>
  </>;
}

function ListingsSection({ role, setSection }) {
  const [filter, setFilter] = useState("All");
  const custom = (() => { try { return JSON.parse(localStorage.getItem("parksetuListing") || "null"); } catch { return null; } })();
  const items = [
    ...parkingSpaces.slice(0, 3).map(x => ({ ...x, status: "Published / Active" })),
    ...(custom ? [{ ...custom, name: custom.name || "My new parking space", area: custom.location, status: custom.status || "Verification" }] : []),
  ];
  const shown = items.filter(x => filter === "All" || x.status.toLowerCase().includes(filter.toLowerCase()));
  return <>
    <SectionTitle eyebrow="LISTING MANAGEMENT" title="My parking listings" copy="Manage lifecycle, availability, photos, verification and marketplace visibility." action={role === "owner" ? <Link className="ws-primary" to="/list-your-space"><Plus size={17}/> Add listing</Link> : null} />
    <div className="ws-filterbar"><div className="segmented">{["All", "Published", "Verification", "Paused"].map(x => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div><button className="ws-secondary"><Filter size={16}/> More filters</button></div>
    <div className="listing-table"><div className="table-head"><span>Listing</span><span>Location</span><span>Status</span><span>Price</span><span>Actions</span></div>{shown.map(item => <div className="table-row" key={item.id}><div className="table-listing"><div className="ws-avatar"><CarFront size={18}/></div><div><b>{item.name}</b><span>{item.parkingType || item.parkingType} · {item.vehicleType || item.vehicle}</span></div></div><span>{item.area || item.location || "Bengaluru"}</span><Status tone={item.status === "Published / Active" ? "green" : "amber"}>{item.status}</Status><b>₹{Number(item.price || item.monthlyPrice || 0).toLocaleString("en-IN")}<small>/month</small></b><button className="icon-btn"><ChevronRight size={17}/></button></div>)}</div>
  </>;
}

function VerificationSection() {
  return <>
    <SectionTitle eyebrow="TRUST & FIELD OPERATIONS" title="Verification centre" copy="Assignments, live GPS checkpoints, evidence and review decisions stay visible in one workflow." />
    <div className="verification-banner"><div><ShieldCheck size={28}/><div><b>Live verification checkpoint</b><span>Engineer must be within the configured radius and provide reliable device accuracy.</span></div></div><strong>100 m</strong></div>
    <div className="ws-grid-2"><Panel title="Today's assignments" eyebrow="FIELD VISITS"><VerificationRow name="Indiranagar Metro Parking" engineer="Arjun Kumar" distance="42 m" accuracy="8 m" status="Ready" /><VerificationRow name="Koramangala Private Slot" engineer="Meena Rao" distance="128 m" accuracy="24 m" status="Outside radius" danger /><VerificationRow name="HSR Layout Covered Bay" engineer="Vikram S" distance="61 m" accuracy="6 m" status="Ready" /></Panel><Panel title="Evidence checklist" eyebrow="REVIEW"><CheckRow text="Engineer location permission granted" done /><CheckRow text="Live location refreshed during visit" done /><CheckRow text="Distance <= configured radius" done /><CheckRow text="GPS accuracy within threshold" done /><CheckRow text="Verification photos uploaded" /><CheckRow text="Notes added for exceptions / rejection" /></Panel></div>
    <Panel title="Verification activity" eyebrow="AUDITABLE EVENTS"><div className="timeline"><Timeline icon={MapPin} title="HSR Layout checkpoint captured" meta="2 min ago · 61 m · accuracy 6 m" /><Timeline icon={FileCheck2} title="Evidence package uploaded" meta="18 min ago · 4 photos" /><Timeline icon={XCircle} title="Koramangala visit flagged" meta="32 min ago · 128 m from listing" /></div></Panel>
  </>;
}

function ConnectionsSection() {
  return <>
    <SectionTitle eyebrow="CONNECT MARKETPLACE" title="Connections & Connects" copy="Connection access is an entitlement. The platform unlocks eligible contact details without becoming the private rental party." />
    <div className="connect-top"><div className="connect-card"><span className="eyebrow">AVAILABLE</span><strong>2</strong><b>Launch Connects</b><p>2 free contacts remaining from your configured launch entitlement.</p><button className="ws-primary">Buy Connect package <ArrowRight size={16}/></button></div><div className="connect-card light"><span className="eyebrow">EXCEPTION</span><strong>1</strong><b>Admin-granted Connect</b><p>Valid for one eligible listing. Every exception is recorded with a reason and audit timestamp.</p><Status tone="purple">Active</Status></div></div>
    <Panel title="Connection history" eyebrow="RECENT"><div className="connection-table"><div className="table-head"><span>Listing</span><span>Date</span><span>Entitlement</span><span>Status</span><span /></div><div className="table-row"><div className="table-listing"><div className="ws-avatar"><CarFront size={18}/></div><div><b>Indiranagar Metro Parking</b><span>Covered · Car</span></div></div><span>23 Sep 2026</span><span>Launch Connect</span><Status>Contact unlocked</Status><button className="ws-link">Open</button></div><div className="table-row"><div className="table-listing"><div className="ws-avatar"><CarFront size={18}/></div><div><b>Koramangala Private Slot</b><span>Open · Car</span></div></div><span>21 Sep 2026</span><span>Admin exception</span><Status tone="purple">Contact unlocked</Status><button className="ws-link">Open</button></div></div></Panel>
  </>;
}

function PaymentsSection({ role }) {
  return <>
    <SectionTitle eyebrow={role === "admin" ? "FINANCE OPERATIONS" : "PAYMENTS & BILLING"} title={role === "admin" ? "Transactions, invoices & reconciliation" : "Payments & invoices"} copy="Show configured package charges, transaction states, invoices, refunds and provider references without storing payment credentials." action={role !== "admin" ? <button className="ws-primary"><Package size={17}/> Browse packages</button> : null} />
    <div className="finance-cards"><div><span>Successful</span><strong>{role === "admin" ? "₹1,82,400" : "₹3,499"}</strong><small>Confirmed server-side</small></div><div><span>Pending</span><strong>{role === "admin" ? "₹8,200" : "₹0"}</strong><small>Awaiting provider confirmation</small></div><div><span>Refunded</span><strong>{role === "admin" ? "₹4,800" : "₹0"}</strong><small>Linked to original transaction</small></div></div>
    <Panel title="Transaction ledger" eyebrow="PAYMENT STATUS"><div className="listing-table"><div className="table-head"><span>Transaction</span><span>Product</span><span>Amount</span><span>Status</span><span>Receipt</span></div>{[["PSU-TXN-10492","Connect 5","₹499","Success"],["PSU-TXN-10480","Second listing","₹999","Success"],["PSU-TXN-10461","Connect 10","₹899","Pending"]].map(([id,product,amount,status]) => <div className="table-row" key={id}><div><b>{id}</b><small>23 Sep 2026 · Razorpay order linked</small></div><span>{product}</span><b>{amount}</b><Status tone={status === "Pending" ? "amber" : "green"}>{status}</Status><button className="icon-btn"><Receipt size={17}/></button></div>)}</div></Panel>
  </>;
}

function PackagesSection() {
  const packs = [["Connect 3","3 Connects","₹299","30 days"],["Connect 5","5 Connects","₹499","45 days"],["Connect 10","10 Connects","₹899","60 days"]];
  return <><SectionTitle eyebrow="COMMERCIAL CONFIGURATION" title="Connect packages & launch rules" copy="All pricing, free entitlements, validity and limits remain configurable rather than hardcoded." action={<button className="ws-primary"><Plus size={17}/> New package</button>} /><div className="rule-strip"><div><b>First listing free</b><span>Enabled</span></div><div><b>Free Searcher Connects</b><span>3</span></div><div><b>Admin exception</b><span>1–2 Connects</span></div><div><b>Verification radius</b><span>100 m</span></div></div><div className="package-grid">{packs.map(([name,connects,price,validity],i)=><div className={`package-card ${i===1?"featured":""}`} key={name}>{i===1&&<span className="package-tag">POPULAR</span>}<span className="eyebrow">CONNECT PACKAGE</span><h3>{name}</h3><strong>{price}</strong><span>{connects} · {validity}</span><p>Configurable package for eligible Searchers after launch entitlement is exhausted.</p><button className="ws-secondary">Edit package</button></div>)}</div></>;
}

function ReportsSection() {
  return <><SectionTitle eyebrow="BUSINESS INTELLIGENCE" title="Marketplace performance" copy="Track supply, demand, connections, paid conversion, verification, payments and repeat usage by period and locality." /><div className="chart-card"><div className="chart-head"><div><b>Connection funnel</b><span>Last 30 days</span></div><select className="ws-select"><option>All Bengaluru</option><option>Indiranagar</option><option>Koramangala</option></select></div><div className="bars">{[["Searches","1426","76%"],["Listing views","982","58%"],["Connection attempts","186","31%"],["Successful connections","112","19%"],["Paid conversions","47","8%"]].map(([name,value,width])=><div className="bar-row" key={name}><span>{name}</span><div><i style={{width}} /></div><b>{value}</b></div>)}</div></div><div className="ws-grid-3"><MiniKpi title="Verified supply" value="72" detail="+8 this month" icon={BadgeCheck} /><MiniKpi title="Payment success" value="94.6%" detail="Gateway confirmed" icon={CircleDollarSign} /><MiniKpi title="Connect utilization" value="68%" detail="Across active users" icon={MessageCircle} /></div></>;
}

function UsersSection() { return <><SectionTitle eyebrow="USER MANAGEMENT" title="Users & account states" copy="Review Lister, Searcher, Verification Engineer and Admin accounts with status and operational context." action={<button className="ws-secondary"><Filter size={16}/> Filters</button>} /><div className="listing-table"><div className="table-head"><span>User</span><span>Role</span><span>Verification</span><span>Status</span><span>Action</span></div>{[["Ananya Rao","Searcher","Verified","Active"],["Rahul Shetty","Lister","KYC complete","Active"],["Meena Rao","Verification Engineer","Authorized","Active"],["Kiran Nair","Lister","Pending review","Pending"]].map(([name,role,verify,status])=><div className="table-row" key={name}><div className="table-listing"><div className="ws-avatar"><Users size={18}/></div><div><b>{name}</b><span>{name.toLowerCase().replace(" ",".")}@example.com</span></div></div><span>{role}</span><Status tone={verify === "Pending review" ? "amber" : "green"}>{verify}</Status><span>{status}</span><button className="ws-link">Manage</button></div>)}</div></> }

function CouponsSection() { return <><SectionTitle eyebrow="PROMOTIONS" title="Coupons & campaigns" copy="Configure coupon code, discount type, validity, usage limits and eligible packages." action={<button className="ws-primary"><Plus size={17}/> Create coupon</button>} /><div className="coupon-grid"><Coupon code="WELCOME50" discount="50%" usage="128 / 500" status="Active"/><Coupon code="CONNECT100" discount="₹100" usage="64 / 100" status="Active"/><Coupon code="CITYMOVE" discount="20%" usage="Expired" status="Expired"/></div></> }

function RbacSection() { return <><SectionTitle eyebrow="SECURITY & CONTROL" title="Roles, permissions & UBAC" copy="Map module/action permissions and add user-specific overrides. Backend enforcement will mirror these controls when APIs are added." action={<button className="ws-primary"><Plus size={17}/> Create role</button>} /><div className="role-permission-grid">{[["Super Admin","Full platform control","24 permissions"],["Finance / Billing","Transactions, invoices, refunds","11 permissions"],["Verification Engineer","Assigned verification workflow","8 permissions"],["Operations Admin","Listings, users, support","17 permissions"]].map(([role,desc,count])=><div className="permission-card" key={role}><div className="ws-avatar"><ShieldCheck size={18}/></div><div><b>{role}</b><span>{desc}</span><small>{count}</small></div><ChevronRight size={17}/></div>)}</div></> }

function NotificationsSection() { return <><SectionTitle eyebrow="COMMUNICATION CENTRE" title="Notifications & event templates" copy="Email, SMS, push and in-app events are previewed here; provider configuration can be connected later." action={<button className="ws-primary"><Plus size={17}/> New template</button>} /><div className="notification-grid">{[["Welcome / Onboarding","Email + Push","Enabled"],["KYC status","Email + Push","Enabled"],["Listing status","Email + Push","Enabled"],["Payment success / failure","Email + Push","Mandatory"],["Invoice generated","Email","Enabled"],["Connection created","Email + Push","Enabled"],["Renewal reminder","Email + Push","Enabled"],["Refund / reversal","Email","Enabled"]].map(([title,channel,status])=><div className="notification-card" key={title}><Bell size={18}/><div><b>{title}</b><span>{channel}</span></div><Status tone={status === "Mandatory" ? "purple" : "green"}>{status}</Status></div>)}</div></> }

function SupportSection() { return <><SectionTitle eyebrow="HELP & SAFETY" title="Support & reports" copy="Raise issues from a relevant listing, connection, transaction or invoice and track the reference ID." action={<button className="ws-primary"><Plus size={17}/> Raise issue</button>} /><div className="support-grid"><div className="support-card"><MessageCircle size={24}/><b>Payment issue</b><span>Reference PSU-TXN-10461</span><Status tone="amber">Under review</Status></div><div className="support-card"><ShieldCheck size={24}/><b>Verification question</b><span>Listing PSU-LST-1008</span><Status>Resolved</Status></div><div className="support-card"><Phone size={24}/><b>Communication report</b><span>Connection PSU-CON-2201</span><Status tone="purple">Open</Status></div></div><Panel title="FAQ categories" eyebrow="HELP CENTRE"><div className="faq-grid"><span>How ParkSetu works</span><span>Listings & verification</span><span>Connects & packages</span><span>Payments & refunds</span><span>Safety & privacy</span><span>Account & login</span></div></Panel></> }

function AccountSection({ role }) { return <><SectionTitle eyebrow="ACCOUNT" title={role === "admin" ? "Platform settings" : "My account"} copy="Profile, login methods, locality, vehicle details and notification preferences." /><div className="account-layout"><Panel title="Profile" eyebrow="IDENTITY"><div className="profile-head"><div className="profile-avatar">PS</div><div><h3>{role === "admin" ? "ParkSetu Super Admin" : role === "owner" ? "Space Lister" : "Parking Seeker"}</h3><span>Verified email · +91 9XXXX XXXXX</span></div><button className="ws-secondary">Edit</button></div><div className="field-grid"><Field label="Email" value="user@parksetu.com"/><Field label="Mobile" value="+91 98XXX 12345"/><Field label="City" value="Bengaluru"/><Field label="Preferred locality" value="Indiranagar"/></div></Panel><Panel title="Preferences" eyebrow="CONTROL"><CheckRow text="Email notifications" done/><CheckRow text="Push notifications" done/><CheckRow text="SMS notifications" /><CheckRow text="Security & transaction alerts" done/><CheckRow text="Privacy consent" done/></Panel></div></> }

function AuditSection() { return <><SectionTitle eyebrow="IMMUTABLE OPERATIONS LOG" title="Audit history" copy="Sensitive listing, verification, payment, role, coupon, referral and exception actions should be traceable." /><Panel title="Recent audit events" eyebrow="LATEST"><div className="audit-list">{[["Super Admin","Updated Connect 5 package","2 min ago"],["Verification Engineer","Captured GPS checkpoint","18 min ago"],["Finance","Marked transaction PSU-TXN-10480 reconciled","41 min ago"],["Operations Admin","Approved listing PSU-LST-1004","1 hr ago"],["Super Admin","Granted 1 Connect exception","2 hrs ago"]].map(([actor,action,time])=><div className="audit-row" key={actor+action}><div className="ws-avatar"><History size={16}/></div><div><b>{actor}</b><span>{action}</span></div><time>{time}</time></div>)}</div></Panel></> }

function SearchSection() { return <><SectionTitle eyebrow="PUBLIC DISCOVERY" title="Find parking" copy="Public users can browse basic listing details. Login is required before protected contact information and precise location are revealed." action={<Link className="ws-primary" to="/search"><Search size={17}/> Open full search</Link>} /><div className="preview-search"><div className="preview-searchbar"><MapPin size={19}/><input placeholder="Locality, landmark or area" defaultValue="Indiranagar"/><select><option>Car</option><option>Bike</option></select><button className="ws-primary"><Search size={16}/> Search</button></div><div className="preview-results">{parkingSpaces.slice(0,3).map(space=><div className="preview-result" key={space.id}><div className="result-art"><CarFront size={34}/></div><div><Status>Verified</Status><h3>{space.name}</h3><span><MapPin size={13}/> {space.area}, Bengaluru · {space.parkingType}</span><div className="tag-row"><span>{space.vehicleType}</span><span>Covered / Open</span><span>Monthly</span></div></div><div><strong>₹{space.price.toLocaleString("en-IN")}</strong><small>/month</small><button className="ws-secondary">View</button></div></div>)}</div></div></> }

function Panel({ title, eyebrow, children, action, onAction }) { return <section className="ws-panel"><div className="ws-panel-head"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div>{action && <button className="ws-link" onClick={onAction}>{action} <ArrowRight size={14}/></button>}</div>{children}</section> }
function SectionTitle({ eyebrow, title, copy, action }) { return <div className="ws-section-title"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{copy}</p></div>{action}</div> }
function Timeline({ icon: Icon, title, meta }) { return <div className="timeline-item"><div className="timeline-icon"><Icon size={16}/></div><div><b>{title}</b><span>{meta}</span></div></div> }
function CheckRow({ text, done = false }) { return <div className="check-row">{done ? <CheckCircle2 size={17}/> : <Clock3 size={17}/>}<span>{text}</span>{done && <Status>Done</Status>}</div> }
function VerificationRow({ name, engineer, distance, accuracy, status, danger }) { return <div className="verification-row"><div><b>{name}</b><span>{engineer}</span></div><span>{distance}</span><span>± {accuracy}</span><Status tone={danger ? "danger" : status === "Ready" ? "green" : "amber"}>{status}</Status></div> }
function MiniKpi({ title, value, detail, icon: Icon, onClick }) { return <button className="mini-kpi" onClick={onClick}><div className="ws-avatar"><Icon size={18}/></div><div><span>{title}</span><strong>{value}</strong><small>{detail}</small></div><ChevronRight size={17}/></button> }
function Alert({ title, meta, icon: Icon, tone }) { return <div className={`ws-alert ${tone}`}><Icon size={19}/><div><b>{title}</b><span>{meta}</span></div><ChevronRight size={16}/></div> }
function Coupon({ code, discount, usage, status }) { return <div className="coupon-card"><div className="coupon-top"><span>{code}</span><Status tone={status === "Expired" ? "amber" : "green"}>{status}</Status></div><strong>{discount}</strong><span>{usage}</span><button className="ws-secondary">Manage</button></div> }
function Field({ label, value }) { return <label className="ws-field"><span>{label}</span><input className="input" value={value} readOnly /></label> }
function EyeIcon(props) { return <Activity {...props}/> }

export default function Workspace() {
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role === "owner" ? "owner" : user?.role === "admin" ? "admin" : "user";
  const items = navByRole[role];
  const [section, setSection] = useState("overview");
  const active = useMemo(() => items.find(x => x[0] === section), [items, section]);

  const renderSection = () => {
    switch (section) {
      case "search": return <SearchSection />;
      case "connections": return <ConnectionsSection />;
      case "listings": return <ListingsSection role={role} setSection={setSection} />;
      case "verification": return <VerificationSection />;
      case "analytics": return <ReportsSection />;
      case "payments": return <PaymentsSection role={role} />;
      case "packages": return <PackagesSection />;
      case "reports": return <ReportsSection />;
      case "users": return <UsersSection />;
      case "coupons": return <CouponsSection />;
      case "rbac": return <RbacSection />;
      case "notifications": return <NotificationsSection />;
      case "support": return <SupportSection />;
      case "audit": return <AuditSection />;
      case "account": return <AccountSection role={role} />;
      case "saved": return <SearchSection />;
      default: return <Overview role={role} setSection={setSection} />;
    }
  };

  return <div className="workspace-page"><div className="workspace-shell">
    <aside className="workspace-sidebar">
      <div className="workspace-brand"><img src="/parksetu-favicon.png" alt=""/><div><b>ParkSetu</b><span>{role === "admin" ? "Control Centre" : role === "owner" ? "Lister Workspace" : "Parking Seeker"}</span></div></div>
      <div className="workspace-nav">{items.map(([id,label,Icon]) => <button key={id} className={section === id ? "active" : ""} onClick={() => { if (role === "user" && id === "search") { navigate("/search"); return; } setSection(id); }}><Icon size={17}/><span>{label}</span>{["notifications","verification","payments"].includes(id) && <i />}</button>)}</div>
      <div className="workspace-side-card"><Sparkles size={19}/><b>UI-only preview</b><span>All data is mock/localStorage until the backend is connected.</span></div>
      <Link to="/" className="back-home"><ArrowRight size={15}/> Back to website</Link>
    </aside>
    <main className="workspace-main">
      <header className="workspace-topbar"><div><span className="workspace-breadcrumb">ParkSetu / {active?.[1]}</span><h1>{active?.[1]}</h1></div><div className="workspace-user"><button className="top-icon"><Bell size={18}/><i /></button><div className="top-avatar">{role === "admin" ? "SA" : role === "owner" ? "SL" : "PS"}</div><div><b>{role === "admin" ? "Super Admin" : role === "owner" ? "Space Lister" : "Parking Seeker"}</b><span>{role === "admin" ? "Operations" : "Bengaluru"}</span></div></div></header>
      <div className="workspace-content">{renderSection()}</div>
    </main>
  </div></div>;
}
