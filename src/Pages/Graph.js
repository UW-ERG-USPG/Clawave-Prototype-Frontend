import React, { useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import ViolinChart from "../components/ViolinChart";
import BoxPlot from "../components/BoxPlot";
import TypeCard from "../components/TypeCard";
import axios from "axios";
import ScatterPlot from "../components/ScatterPlot";
import ScatterPlot1 from "../components/ScatterPlot1";
import { useSearchParams } from "react-router-dom";
const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "https://198-168-187-196.cloud.computecanada.ca:443"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const Graph = () => {
  const [searchParams] = useSearchParams();
  const [param, setParam] = useState(searchParams.get("station"));
  const [graph1, setGraph1] = useState(null);
  const [graph2, setGraph2] = useState(null);
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState(null);
  const [menu, setMenu] = useState(true);

  const [curVis, setCurVis] = useState(1)

  const buildUrl = (graph) => {
    if (!graph) return "";
    console.log(graph);
    const { graph: graphType, Station, characteristic, load } = graph;
    switch (graphType) {
      case "Flux vs Time - Line Graph":
        return load
          ? `load-calculation?nutrients=` +
              encodeURIComponent(load) +
              `&station=` +
              encodeURIComponent(Station) +
              `&gType=ft`
          : "";
      case "Conc vs Time - Line Graph":
        return load
          ? `load-calculation?nutrients=` +
              encodeURIComponent(load) +
              `&station=` +
              encodeURIComponent(Station) +
              `&gType=ct`
          : "";
      case "Flux Q - Scatter Plot":
      case "Conc Q - Scatter Plot":
        return load
          ? `cqf-calculation?nutrients=` +
              encodeURIComponent(load) +
              `&station=` +
              encodeURIComponent(Station)
          : "";
      case "Hydrograph":
        return Station && characteristic ? "" : "";
      case "Discharge vs Time - Line Graph":
      case "Discharge vs Time - Box Plot":
      case "Discharge vs Time - Violin Chart":
        return Station ? `/discharge-data/${Station}` : "";
      case "Water Quality vs Time - Box Plot":
      case "Water Quality vs Time - Violin Chart":
      case "Water Quality - Scatter Plot":
        return Station && characteristic
          ? `/wq-data/${Station}?nutrients=${characteristic}`
          : "";
      default:
        return "";
    }
  };

  useEffect(() => {
    setUrl1(buildUrl(graph1));
  }, [graph1]);

  useEffect(() => {
    setUrl2(buildUrl(graph2));
  }, [graph2]);

  useEffect(() => {
    const fetchData = async () => {
      if (url1 === "") {
        setData(null);
        setError1(null);
        setLoading1(false);
        return;
      }

      setLoading1(true);
      try {
        const response = await axiosInstance.get(url1, {
          headers: {
            Accept: "application/json",
          },
        });
        console.log(response.data);
        if (response.data) {
          setData(response.data);
          setError1(null);
        } else {
          throw new Error("No data available for the selected range.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError1(err.message);
        setData(null);
      } finally {
        setLoading1(false);
      }
    };
    fetchData();
  }, [url1]);

  useEffect(() => {
    const fetchData = async () => {
      if (url2 === "") {
        setData2(null);
        setError2(null);
        setLoading2(false);
        return;
      }

      setLoading2(true);
      try {
        const response = await axiosInstance.get(url2, {
          headers: {
            Accept: "application/json",
          },
        });
        if (response.data) {
          setData2(response.data);
          setError2(null);
        } else {
          throw new Error("No data available for the selected range.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError2(err.message);
        setData2(null);
      } finally {
        setLoading2(false);
      }
    };
    fetchData();
  }, [url2]);

  const renderGraph = (graphType, data) => {
    switch (graphType.graph) {
      case "Flux vs Time - Line Graph":
        return (
          <LineChart
            data={data}
            width={1500}
            height={480}
            xLabel={"Date (YYYY-MM-DD)"}
            yLabel={"Flux in 10^3 Kg/day"}
            title={`Flux vs Time for Saskatchewan River at Grand Rapids`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            station={`${graphType.stationName}`}
          />
        );
      case "Conc vs Time - Line Graph":
        return (
          <LineChart
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Concentration in mg/L"}
            title={`Conc vs Time for Saskatchewan River at Grand Rapids`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            station={`${graphType.stationName}`}
          />
        );
      case "Flux Q - Scatter Plot":
        return (
          <ScatterPlot
            data={data}
            width={1500}
            height={480}
            xLabel={"Discharge in m^3/s"}
            yLabel={"Flux in 10^3 kg/day"}
            title={`Flux vs Discharge for Saskatchewan River at Grand Rapids`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            station={`${graphType.stationName}`}
          />
        );
      case "Conc Q - Scatter Plot":
        return (
          <ScatterPlot1
            data={data}
            width={1500}
            height={480}
            xLabel={"Discharge in m^3/s"}
            yLabel={"Concentration in mg/L"}
            title={`Conc vs Discharge for Saskatchewan River at Grand Rapids`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            station={`${graphType.stationName}`}
          />
        );
      case "Hydrograph":
        return <div></div>;

      case "Discharge vs Time - Line Graph":
        return (
          <LineChart
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Discharge in m^3/s"}
            title={`Discharge vs Time for ${graphType.stationName}`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            station={`${graphType.stationName}`}
          />
        );

      case "Discharge vs Time - Box Plot":
        return (
          <BoxPlot
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Discharge in m^3/s"}
            title={`Discharge vs Time for ${graphType.stationName}`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            temporal={`${graphType.temporal}`}
            station={`${graphType.stationName}`}
          />
        );

      case "Discharge vs Time - Violin Chart":
        return (
          <ViolinChart
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Discharge in m^3/s"}
            title={`Discharge vs Time for ${graphType.stationName}`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            temporal={`${graphType.temporal}`}
            station={`${graphType.stationName}`}
          />
        );

      case "Water Quality vs Time - Box Plot":
        return (
          <BoxPlot
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Observed Values in mg/L"}
            title={` ${graphType.characteristic} vs Time graph for ${graphType.stationName}`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            temporal={`${graphType.temporal}`}
            station={`${graphType.stationName}`}
          />
        );
      
      case "Water Quality vs Time - Violin Chart":
        return (
          <ViolinChart
            data={data}
            width={1500}
            height={480}
            xLabel={"Date"}
            yLabel={"Observed Values in mg/L"}
            title={`${graphType.characteristic} vs Time for ${graphType.stationName}`}
            startDate={`${graphType.startDate}`}
            endDate={`${graphType.endDate}`}
            temporal={`${graphType.temporal}`}
            station={`${graphType.stationName}`}
          />
        );

      case "Water Quality - Scatter Plot":
        return <div></div>;

      default:
        return <div></div>;
    }
  };

  const handleGraph1Click = (value) => setGraph1(value);
  const handleGraph2Click = (value) => setGraph2(value);
  return (
    <div className="flex w-full h-screen">
      <div
        className="w-1/5 bg-slate-500 p-5 border-black border-r-2"
        style={{ display: !menu ? "none" : "" }}
      >
        <div className="menu flex items-center justify-center gap-2 rounded-lg border border-gray-400 p-2">
          <button className = "menu-button flex-1 p-2 rounded-lg" onClick={() => setMenu(false)}>Collapse</button>
        </div>
        <div className="menu flex items-center justify-center gap-2 rounded-lg border border-gray-400 p-2">
          <button
            className={`menu-button flex-1 p-2 rounded-lg ${curVis === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setCurVis(1)}
          >
            Visualization 1
          </button>
          <button
            className={`menu-button flex-1 p-2 rounded-lg ${curVis === 2 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setCurVis(2)}
          >
            Visualization 2
          </button>
        </div>
        <div className="mt-5">
          {curVis === 1 && (<div><div>Visualization 1</div> <TypeCard onGenerate={handleGraph1Click} ID={"G1"} selectedStation={param}/></div>)}        
          {curVis === 2 && (<div><div>Visualization 2</div> <TypeCard onGenerate={handleGraph2Click} ID={"G2"} /></div>)}
        </div>
      </div>
      <div className="py-5 px-5" style={{ display: menu ? "none" : "" }}>
        <button onClick={() => setMenu(true)}>expand</button>
      </div>
      <div className="justify-center w-full container mx-auto ">
        <div className="flex-grid">
          {loading1 && <div>Loading...</div>}
          {error1 && <div>Error: {error1}</div>}
          {graph1 && !loading1 && !data && (
            <div>Invlaid Parameters! pls provide valid </div>
          )}
          {graph1 && !loading1 && data && renderGraph(graph1, data)}
          {loading2 && <div>Loading...</div>}
          {error2 && <div>Error: {error2}</div>}
          {graph2 && !loading2 && !data2 && (
            <div>Invlaid Parameters! pls provide valid </div>
          )}
          {graph2 && !loading2 && data2 && renderGraph(graph2, data2)}
        </div>
      </div>
    </div>
  );
};

export default Graph;
