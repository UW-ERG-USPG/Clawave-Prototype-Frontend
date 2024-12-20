import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

function App() {
  return (
    <div>
      <div className="sticky z-100">
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}

export default App;
