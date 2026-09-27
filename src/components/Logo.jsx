import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/parksetu-logon.png";

export default function Logo() {
  return (
    <Link to="/" className="brand">
      <img src={logo} alt="ParkSetu" />
      {/* <span><b>Park</b><strong>Setu</strong></span> */}
    </Link>
  );
}
