import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    localStorage.setItem("parksetuUser", JSON.stringify({ name: form.name, email: form.email, phone: form.phone }));
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <span className="eyebrow">JOIN PARKSETU</span>
        <h1>Your parking journey starts here.</h1>
        <p>Create one account to find, book and manage parking spaces wherever you go.</p>
        <div className="auth-points">
          <div><CheckCircle2 size={18} /> Find parking nearby</div>
          <div><CheckCircle2 size={18} /> Save your favourite spaces</div>
          <div><CheckCircle2 size={18} /> Track your bookings</div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <h2>Create account</h2>
          <p>Join ParkSetu in less than a minute.</p>

          <div className="form-group">
            <label>Full name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label>Mobile number</label>
            <input className="input" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 00000 00000" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" />
          </div>

          <button className="btn btn-primary auth-submit">Create account</button>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
