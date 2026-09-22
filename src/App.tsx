import { NavLink, Route, Routes } from "react-router-dom";
import { AddPage } from "./Pages/AddPage";
import { MonitorPage } from "./Pages/MonitorPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <div className="shell">
        <header className="topbar">
          <NavLink className="brand" to="/add">
            <span className="brand-mark">FM</span>
            <span className="brand-copy"><strong>Flow Monitor</strong><span>transaction intelligence</span></span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/add">Simulator</NavLink>
            <NavLink to="/monitor">Live Monitor</NavLink>
          </nav>
        </header>

        <main className="content">
          <div className="page-intro">
            <p className="eyebrow">Operations / Financial stream</p>
            <h1>See every transaction<br />as it happens.</h1>
            <p className="lede">A calm command center for sending, tracking, and understanding live financial activity.</p>
          </div>
        <Routes>
          <Route path="/" element={<AddPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
        </main>
      </div>
    </div>
  );
}
