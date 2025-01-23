import { HashRouter, Route, Routes } from "react-router-dom";
import ComparePage from "./pages/ComparePage";
import OverviewPage from "./pages/OverviewPage";

function App() {
  return (
    <span style={{ display: "flex" }}>
      <HashRouter basename={""}>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </HashRouter>
    </span>
  );
}

export default App;
