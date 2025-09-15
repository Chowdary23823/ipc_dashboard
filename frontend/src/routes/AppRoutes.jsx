import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Reliabilityweekly from "../pages/Reliabilityweekly";
import Attainment from "../pages/Attainment";
import Reliability from "../pages/Reliability";
import EagleEye from "../pages/EagleEye";
import FDP_view from "../pages/FDP_view";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/Reliabilityweekly" element={<Reliabilityweekly />} />
        <Route path="/Attainment" element={<Attainment />} />
        <Route path="/Reliability" element={<Reliability />} />
        <Route path="/EagleEye" element={<EagleEye />} />
        <Route path="/FDP_view" element={<FDP_view />} />
       

      </Routes>
    </Layout>
  );
}