import { NavLink, Route, Routes } from "react-router-dom";
import { AddPage } from "./pages/AddPage";
import { MonitorPage } from "./pages/MonitorPage";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <header>
        <div>
          <h1>Real-Time Financial Monitor</h1>
          <p>Mid Full Stack Assessment</p>
        </div>
        <nav>
          <NavLink to="/add">Simulator</NavLink>
          <NavLink to="/monitor">Live Monitor</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<AddPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
      </main>
    </div>
  );
}
