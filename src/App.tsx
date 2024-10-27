import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/homePage/homePage";
import LightPage from "./pages/lightPage/iluminacaoPage";
import { useState } from "react";

const App = () => {
  const location = useLocation();
  const [showPage] = useState(true);

  return (
    <div className={`page-container ${showPage ? "fade-in" : "fade-out"}`}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/iluminacao" element={<LightPage />} />
      </Routes>
    </div>
  );
};

export default App;
