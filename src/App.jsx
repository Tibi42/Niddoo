import { useState } from "react";
import { Routes, Route } from "react-router-dom";
// ... existing code ...
import Home from "./pages/Home.jsx";
import Renovation from "./pages/Renovation.jsx";
import Maitrise from "./pages/Maitrise.jsx";
import Garanties from "./pages/Garanties.jsx";
import Aide from "./pages/Aide.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/renovation" element={<Renovation />} />
        <Route path="/maitrise" element={<Maitrise />} />
        <Route path="/garanties" element={<Garanties />} />
        <Route path="/aide" element={<Aide />} />
      </Routes>
    </>
  );
}

export default App;