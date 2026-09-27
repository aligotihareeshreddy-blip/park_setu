import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, UserRound, Building2, CheckCircle2, ArrowRight, CarFront, Eye, EyeOff } from "lucide-react";
import "./Auth.css";

const accounts = {
  user: { email:"user@gmail.com", password:"user", title:"User", subtitle:"Find and connect to parking", icon:UserRound, color:"green", redirect:"/workspace" },
  owner: { email:"lister@gmail.com", password:"lister", title:"List Your Space", subtitle:"List and manage your parking space", icon:Building2, color:"blue", redirect:"/workspace" },
  admin: { email:"admin@gmail.com", password:"admin", title:"Admin", subtitle:"Manage listings and verification", icon:ShieldCheck, color:"navy", redirect:"/workspace" }
};

export default function Login(){
  const navigate=useNavigate();
  const [role,setRole]=useState("user");
  const [email,setEmail]=useState(accounts.user.email);
  const [password,setPassword]=useState(accounts.user.password);
  const [show,setShow]=useState(false);
  const [error,setError]=useState("");

  const selectRole=(next)=>{setRole(next);setEmail(accounts[next].email);setPassword(accounts[next].password);setError("");};
  const submit=(e)=>{
    e.preventDefault();
    const account=accounts[role];
    if(email.trim().toLowerCase()!==account.email || password!==account.password){
      setError("The email or password is incorrect.");
      return;
    }
    localStorage.setItem("parksetuUser",JSON.stringify({role,email:account.email,name:role==="admin"?"ParkSetu Admin":role==="owner"?"Space Lister":"Parking User",loggedInAt:new Date().toISOString()}));
    navigate(account.redirect);
  };

  return <div className="auth-page role-auth-page">
    <div className="auth-visual">
      <span className="eyebrow">PARKSETU ACCESS</span>
      <h1>Find a space. List a space. Manage the network.</h1>
      <p>A focused parking marketplace with local discovery, structured listings and verification workflows.</p>
      <div className="auth-points">
        <div><CheckCircle2 size={18}/> Monthly parking spaces</div>
        <div><CheckCircle2 size={18}/> Covered, open, basement and plot options</div>
        <div><CheckCircle2 size={18}/> User, lister and admin workspaces</div>
      </div>
      <div className="auth-vehicle-art"><CarFront size={78}/></div>
    </div>
    <div className="auth-form-wrap">
      <div className="auth-form auth-role-card">
        <span className="eyebrow">SIGN IN</span>
        <h2>Choose your workspace</h2>
        <p>Each login opens a different ParkSetu experience.</p>
        <div className="role-grid">
          {Object.entries(accounts).map(([id,a])=>{const Icon=a.icon;return <button type="button" key={id} className={`role-card ${role===id?"active":""} ${a.color}`} onClick={()=>selectRole(id)}><span className="role-icon"><Icon size={21}/></span><span><b>{a.title}</b><small>{a.subtitle}</small></span>{role===id&&<CheckCircle2 size={18}/>}</button>})}
        </div>
        <form onSubmit={submit}>
          
          <div className="form-group"><label>Email</label><input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="form-group password-field"><label>Password</label><div><input className="input" type={show?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} /><button type="button" onClick={()=>setShow(!show)} aria-label="Show password">{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div>
          {error&&<div className="login-error">{error}</div>}
          <button className="btn btn-primary auth-submit">Continue as {accounts[role].title}<ArrowRight size={17}/></button>
        </form>
        {role==="owner"&&<Link className="quick-list" to="/list-your-space"><Building2 size={16}/> Open List Your Space</Link>}
        <div className="auth-switch">New to ParkSetu? <Link to="/signup">Create an account</Link></div>
      </div>
    </div>
  </div>;
}
