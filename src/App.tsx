import React, { useState } from "react";
import OverviewPage from "./pages/OverviewPage";
import NavPane from "./components/NavPane/NavPane";
import ComparePage from "./pages/ComparePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [currentPage, setCurrentPage] = useState<string>("Overview");

  return (
    <span style={{ display: "flex" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </BrowserRouter>
    </span>
  );
}

export default App;
