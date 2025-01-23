import React, { useState } from "react";
import OverviewPage from "./pages/OverviewPage";
import NavPane from "./components/NavPane/NavPane";
import ComparePage from "./pages/ComparePage";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <span style={{ display: "flex" }}>
      <HashRouter basename="/greenhouse-emissions-dashboard">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </HashRouter>
    </span>
  );
}

export default App;
