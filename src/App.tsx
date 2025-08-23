import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/homePage/homePage";
import { useState, useEffect } from "react";
import LightPage from "./pages/lightPage/iluminacaoPage";
import DryingRackPage from "./pages/dryingHack/dryingHack";
import { GardenPage } from "./pages/gardenPage/gardenPage";

const App = () => {
  const location = useLocation();
  const [showPage] = useState(true);

  useEffect(() => {
    const fetchAndStore = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/iluminacao/status`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("smartHomeStatus", JSON.stringify(data));
        }
      } catch (error) {
      }
    };
    fetchAndStore();
    const interval = setInterval(fetchAndStore, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={`page-container ${showPage ? "fade-in" : "fade-out"}`}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/iluminacao" element={<LightPage />} />
        <Route path="/varal" element={<DryingRackPage />} />
        <Route path="/jardim" element={<GardenPage />} />
      </Routes>
    </div>
  );
};

export default App;
