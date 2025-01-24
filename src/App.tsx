import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComparePage from "./pages/ComparePage";
import OverviewPage from "./pages/OverviewPage";

function App() {
  return (
    <span className="display-flex">
      <BrowserRouter basename="/greenhouse-emissions-dashboard">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </BrowserRouter>
    </span>
  );
}

export default App;
