import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ParkSetuLoader from "./components/ParkSetuLoader";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ParkingDetails from "./pages/ParkingDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ListSpace from "./pages/ListSpace";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import Connect from "./pages/Connect";
import NotFound from "./pages/NotFound";
import UserActivity from "./pages/UserActivity";
import AdminReview from "./pages/AdminReview";
import Workspace from "./pages/Workspace";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ParkSetuLoader />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/parking/:id" element={<ParkingDetails />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/list-your-space" element={<ListSpace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/admin/review/:id" element={<AdminReview />} />
        <Route path="/bookings" element={<UserActivity />} />
        <Route path="/saved" element={<UserActivity />} />
        <Route path="/refer" element={<UserActivity />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
