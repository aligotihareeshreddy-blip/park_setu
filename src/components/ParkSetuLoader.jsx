import React from "react";
import "./ParkSetuLoader.css";
import parkSetuIcon from "../assets/parksetu.gif";

export default function ParkSetuLoader() {
  return (
    <div className="parksetu-loader">
      <img src={parkSetuIcon} alt="Loading" />
    </div>
  );
}