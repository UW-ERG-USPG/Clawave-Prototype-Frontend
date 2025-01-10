import { useLocation, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation()

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <h1 className="navbar-logo">
            CLAWAVE PROTOTYPE
          </h1>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`${location.pathname === "/" ? "navbar-links-active" : "navbar-links-inactive"}`}>
            About{" "}
          </Link>
          <Link to="/map" className={`${location.pathname.startsWith("/map") ? "navbar-links-active" : "navbar-links-inactive"}`}>
            Map{" "}
          </Link>
          <Link to="/data" className={`${(location.pathname.startsWith("/data") || location.pathname.startsWith("/wqs") || location.pathname.startsWith("/dis-data")) ? "navbar-links-active" : "navbar-links-inactive"}`}>
            Data{" "}
          </Link>
          <Link to="/graph" className={`${location.pathname.startsWith("/graph") ? "navbar-links-active" : "navbar-links-inactive"}`}>
            Create Visualization{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
