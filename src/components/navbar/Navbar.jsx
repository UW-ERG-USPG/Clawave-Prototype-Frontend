import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-slate-600 z-100 ">
      <div className="container mx-auto flex justify-around py-3">
        <Link to="/">
          <h1 className="sm:text-lg lg:text-3xl font-bold text-slate-50">
            CLAWAVE PROTOTYPE
          </h1>
        </Link>
        <div className="flex w-fit gap-5 justify-around text-2xl font-semibold text-slate-50">
          <Link to="/" className="hover:text-black">
            About{" "}
          </Link>
          <Link to="/map" className="hover:text-black">
            Map{" "}
          </Link>
          <Link to="/data" className="hover:text-black">
            Data{" "}
          </Link>
          <Link to="/graph" className="hover:text-black">
            Create Visualization{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
