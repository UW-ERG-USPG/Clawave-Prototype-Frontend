import { createBrowserRouter } from "react-router-dom";
import Mapa from "../../Pages/Map";
import Data from "../../Pages/Data";
import Graph from "../../Pages/Graph";
import App from "../App";
import Home from "../../Pages/Home";
import DIStation from "../../Pages/distation";
import DisData from "../../Pages/disData";
import WQStation from "../../Pages/wqStat";
import WQData from "../../Pages/wqData";
import WQMeta from "../../Pages/wqMeta";
const Router = createBrowserRouter(
  [
    {
      path: "", // Changed from "/"
      element: <App />,
      children: [
        {
          path: "", // Changed from "/"
          element: <Home />,
        },
        {
          path: "map", // Removed leading slash
          element: <Mapa />,
        },
        {
          path: "data",
          element: <Data />,
        },
        {
          path: "graph",
          element: <Graph />,
        },
        {
          path: "dis",
          element: <DIStation />,
        },
        {
          path: "dis-data/:id",
          element: <DisData />,
        },
        {
          path: "wqm",
          element: <WQMeta />,
        },
        {
          path: "wqs/:id",
          element: <WQStation />,
        },
        {
          path: "wq/:id",
          element: <WQData />,
        },
      ],
    },
  ],
  {
    basename: "/frontend",
  }
);

export default Router;