import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link, useSearchParams } from "react-router-dom";
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "https://api-jemx.onrender.com"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Helper component to update the map view
function SetViewOnClick({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, zoom); // Update map view when coords or zoom change
  }, [coords, zoom, map]);
  return null;
}

export default function Mapa() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [wqdata, setWQData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState([
    parseFloat(searchParams.get("lat")) || 52,//43.4723,
    parseFloat(searchParams.get("long")) || -108,
  ]);
  const [zoom, setZoom] = useState(parseInt(searchParams.get("zoom")) || 6);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState(null);
  const [checkedItems, setCheckedItems] = useState({
    Discharge_Stations: true,
    WQ_Stations: true,
    Load: false,
  });
  const ldata = [
    {
      latitude: 53.16389083862305,
      longitude: -99.34889221191406,
      stationNo: "05KL001",
      stationName: "SASKATCHEWAN RIVER AT GRAND RAPIDS",
      province: "MB",
      status: "Active",
      locationId: 37077,
      doi: "10.25976/x5wn-0523",
      name: "SASKATCHEWAN RIVER (AT GRAND RAPIDS)",
      qlatitude: 53.16051,
      qlongitude: -99.26573,
      monitoringLocationType: "River/Stream",
    },
    {
      latitude: 50.567501068115234,
      longitude: -96.17749786376952,
      stationNo: "05PF069",
      stationName: "WINNIPEG RIVER AT PINE FALLS GENERATING STATION",
      province: "MB",
      status: "Active",
      locationId: 37078,
      doi: "10.25976/x5wn-0523",
      name: "WINNIPEG RIVER (AT PINE FALLS)",
      qlatitude: 50.56766,
      qlongitude: -96.17697,
      monitoringLocationType: "River/Stream",
    },
    {
      latitude: 51.56489181518555,
      longitude: -101.91655731201172,
      stationNo: "05MD004",
      stationName: "ASSINIBOINE RIVER AT KAMSACK",
      province: "SK",
      status: "Active",
      locationId: 790108,
      doi: "10.25976/tm9b-c550",
      name: "ASSINIBOINE RIVER AT HWY 8 BRIDGE",
      qlatitude: 51.5331,
      qlongitude: -101.8889,
      monitoringLocationType: "River/Stream",
    },
    {
      latitude: 49.00374984741211,
      longitude: -97.2238311767578,
      stationNo: "05OC001",
      stationName: "RED RIVER AT EMERSON",
      province: "MB",
      status: "Active",
      locationId: 790110,
      doi: "10.25976/tm9b-c550",
      name: "RED RIVER AT EMERSON, MANITOBA",
      qlatitude: 49.0081,
      qlongitude: -97.2106,
      monitoringLocationType: "River/Stream",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/lw-discharge-station-data?",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    const fetchDatawq = async () => {
      try {
        const response = await axiosInstance.get("/wqs-data?hub=lakewinnipeg", {
          headers: {
            Accept: "application/json",
          },
        });
        setWQData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
    fetchDatawq();
  }, []);
  useEffect(() => {
    const makeList = async () => {
      if (wqdata.length > 0) {
        let temp = [];
        wqdata.map((value) => {
          temp.push({
            name: value.name + " - " + value.locationId + " wq",
            id: value.locationId,
            latitude: value.latitude,
            longitude: value.longitude,
          });
        });
        data.map((value) => {
          temp.push({
            name: value.stationName + " - " + value.stationNo + " dis",
            id: value.stationNo,
            latitude: value.latitude,
            longitude: value.longitude,
          });
        });
        console.log(temp);
        setList(temp);
      }
    };
    makeList();
  }, [data, wqdata]);
  useEffect(() => {
    const getCoords = () => {
      if (search === null) return;
      if (search.name.substring(search.name.length - 1) === "q") {
        setCoords([search.latitude, search.longitude]);
      }
      if (search.name.substring(search.name.length - 1) === "s") {
        setCoords([search.latitude, search.longitude]);
      }
    };
    getCoords();
  }, [search]);

  const customIcon = new Icon({
    iconUrl: "assets/orangecircle.svg",
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  });

  const customIcon1 = new Icon({
    iconUrl: "assets/bluecircle.svg",
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  });
  const customIcon2 = new Icon({
    iconUrl: "assets/redcircle.svg",
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [0, -10],
  });

  const createClusterCustomIcon = function (cluster) {
    return divIcon({
      html: `<div>${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: [48, 48],
    });
  };

  const createClusterCustomIcon1 = function (cluster) {
    return divIcon({
      html: `<div>${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster-1",
      iconSize: [48, 48],
    });
  };
  const createClusterCustomIcon2 = function (cluster) {
    return divIcon({
      html: `<div>${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster-2",
      iconSize: [48, 48],
    });
  };

  const HandleClick = (latitude, longitude, e) => {
    setCoords([latitude, longitude]); // Update coords to center the map
    setZoom(15); // Update zoom level
    console.log(checkedItems);
  };
  const handleChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  return (
    <div className="">
      {!loading ? (
        <div className="relative w-full">
          <MapContainer center={coords} zoom={zoom} className="">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SetViewOnClick coords={coords} zoom={zoom} />

            {checkedItems.Discharge_Stations && (
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={150}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon}
              >
                {data.map((d) => (
                  <Marker
                    position={[d.latitude, d.longitude]}
                    icon={customIcon1}
                    key={`data-${d.stationNo}`}
                    eventHandlers={{
                      click: (e) => {
                        HandleClick(d.latitude, d.longitude, e);
                      },
                      mouseover: (e) => {
                        e.target
                          .bindTooltip(
                            d.stationName + ", (" + d.stationNo + ")"
                          )
                          .openTooltip();
                      },
                      mouseout: (e) => {
                        e.target.closeTooltip();
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-black font-semibold text-lg w-80">
                        <Link
                          to={"/dis-data/" + d.stationNo}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.stationName}
                        </Link>
                        <br /> Station No. : {d.stationNo}
                        <br /> Province : {d.province}
                        <br /> Status : {d.status}
                        <br /> Latitude : {d.latitude.toFixed(4)}
                        <br /> Longitude : {d.longitude.toFixed(4)}
                        <br />
                        <Link
                          to={
                            "/graph?station=" +
                            d.stationName +
                            " - " +
                            d.stationNo +
                            " dis"
                          }
                        >
                          Plot Graph
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
            {checkedItems.WQ_Stations && (
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={150}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon1}
              >
                {wqdata.map((d) => (
                  <Marker
                    key={`wqdata-${d.locationId}`}
                    position={[d.latitude, d.longitude]}
                    icon={customIcon}
                    eventHandlers={{
                      click: (e) => {
                        HandleClick(d.latitude, d.longitude, e);
                      },
                      mouseover: (e) => {
                        e.target
                          .bindTooltip(d.name + ", (" + d.locationId + ")")
                          .openTooltip();
                      },
                      mouseout: (e) => {
                        e.target.closeTooltip();
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-black text-lg font-semibold w-80">
                        <Link
                          to={"/wq/" + d.locationId}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.name}
                        </Link>
                        <br /> DOI :{" "}
                        <Link
                          to={"/wqs/" + d.doi.slice(9)}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.doi}
                        </Link>
                        <br /> ID: {d.locationId}
                        <br /> Monitoring Location Type :{" "}
                        {d.monitoringLocationType}
                        <br /> Latitude : {d.latitude.toFixed(4)}
                        <br /> Longitude : {d.longitude.toFixed(4)}
                        <br />
                        <Link
                          to={
                            "/graph?station=" +
                            d.name +
                            " - " +
                            d.locationId +
                            " wq"
                          }
                        >
                          Plot Graph
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}

            {checkedItems.Load && (
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={150}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                iconCreateFunction={createClusterCustomIcon2}
              >
                {ldata.map((d) => (
                  <Marker
                    position={[d.latitude, d.longitude]}
                    icon={customIcon2}
                    key={`datatemp-${d.stationNo}`}
                    eventHandlers={{
                      click: (e) => {
                        HandleClick(d.latitude, d.longitude, e);
                      },
                      mouseover: (e) => {
                        e.target
                          .bindTooltip(
                            d.stationName + ", (" + d.stationNo + ")"
                          )
                          .openTooltip();
                      },
                      mouseout: (e) => {
                        e.target.closeTooltip();
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-black font-semibold text-lg w-80">
                        <Link
                          to={"/dis-data/" + d.stationNo}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.stationName}
                        </Link>
                        <br /> Station No. : {d.stationNo}
                        <br /> Province : {d.province}
                        <br /> Status : {d.status}
                        <br /> Latitude : {d.latitude.toFixed(4)}
                        <br /> Longitude : {d.longitude.toFixed(4)}
                        <br />
                        <Link
                          to={
                            "/graph?station=" +
                            d.stationName +
                            " - " +
                            d.stationNo +
                            " load"
                          }
                        >
                          Plot Graph
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {ldata.map((d) => (
                  <Marker
                    key={`wqdatatemp-${d.locationId}`}
                    position={[d.qlatitude, d.qlongitude]}
                    icon={customIcon2}
                    eventHandlers={{
                      click: (e) => {
                        HandleClick(d.qlatitude, d.qlongitude, e);
                      },
                      mouseover: (e) => {
                        e.target
                          .bindTooltip(d.name + ", (" + d.locationId + ")")
                          .openTooltip();
                      },
                      mouseout: (e) => {
                        e.target.closeTooltip();
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-black text-lg font-semibold w-80">
                        <Link
                          to={"/wq/" + d.locationId}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.name}
                        </Link>
                        <br /> DOI :{" "}
                        <Link
                          to={"/wqs/" + d.doi.slice(9)}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          {" "}
                          {d.doi}
                        </Link>
                        <br /> ID: {d.locationId}
                        <br /> Monitoring Location Type :{" "}
                        {d.monitoringLocationType}
                        <br /> Latitude : {d.qlatitude.toFixed(4)}
                        <br /> Longitude : {d.qlongitude.toFixed(4)}
                        <br />
                        <Link
                          to={
                            "/graph?station=" +
                            d.name +
                            " - " +
                            d.locationId +
                            " load"
                          }
                        >
                          Plot Graph
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
          </MapContainer>
          <Card className="absolute top-3 left-20 z-[1000] w-96 p-6 bg-white/90 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4">Map Overlay</h2>
            {/*<p>zoom: {zoom}</p>*/}
            <p>Search Bar</p>
            <Autocomplete
              options={list}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setSearch(newValue);
                console.log(newValue);
                setZoom(15);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Station"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
            />
            <p>Filter Box</p>
            <div>
              <input
                type="checkbox"
                id="Discharge_Stations"
                name="Discharge_Stations"
                checked={checkedItems.Discharge_Stations}
                onChange={handleChange}
              />
              <label htmlFor="Discharge_Stations">Discharge Stations</label>
            </div>

            <div>
              <input
                type="checkbox"
                id="WQ_Stations"
                name="WQ_Stations"
                checked={checkedItems.WQ_Stations}
                onChange={handleChange}
              />
              <label htmlFor="WQ_Stations">WQ Stations</label>
            </div>

            <div>
              <input
                type="checkbox"
                id="Load"
                name="Load"
                checked={checkedItems.Load}
                onChange={handleChange}
              />
              <label htmlFor="Load">Load</label>
            </div>
          </Card>
        </div>
      ) : (
        <div>{error ? error : "Loading..."}</div>
      )}
    </div>
  );
}
