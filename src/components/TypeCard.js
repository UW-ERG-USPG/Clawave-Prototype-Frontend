import CustomSelect from "./Select";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Link } from "react-router-dom";
const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "https://198-168-187-196.cloud.computecanada.ca:443"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
const TypeCard = ({ onGenerate, ID, selectedStation }) => {
  const [showGraph, setShowGraph] = useState("");
  const [select, setSelect] = useState(null);
  const [showCharacteristic, setShowCharacteristic] = useState("");
  const [showLoad, setShowLoad] = useState("");
  const [Station, setStation] = useState("");
  const [StationName, setStationName] = useState("");
  const [startDate, setStartDate] = useState("2000-01");
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM"));
  const [wqAutoComplete, setWQAutoComplete] = useState("");
  const [disAutoComplete, setDISAutoComplete] = useState("");
  const [temp, setTemp] = useState("Yearly");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState("Concentration");
  const [selectedState, setSelectedState] = useState(selectedStation);
  const [boo, setboo] = useState(true);
  const buttons = ["Concentration", "Flow", "Load"];
  const [dis, setDis] = useState(true);

  const wqldata = [
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
    // {
    //   latitude: 50.567501068115234,
    //   longitude: -96.17749786376952,
    //   stationNo: "05PF069",
    //   stationName: "WINNIPEG RIVER AT PINE FALLS GENERATING STATION",
    //   province: "MB",
    //   status: "Active",
    //   locationId: 37078,
    //   doi: "10.25976/x5wn-0523",
    //   name: "WINNIPEG RIVER (AT PINE FALLS)",
    //   qlatitude: 50.56766,
    //   qlongitude: -96.17697,
    //   monitoringLocationType: "River/Stream",
    // },
    // {
    //   latitude: 51.56489181518555,
    //   longitude: -101.91655731201172,
    //   stationNo: "05MD004",
    //   stationName: "ASSINIBOINE RIVER AT KAMSACK",
    //   province: "SK",
    //   status: "Active",
    //   locationId: 790108,
    //   doi: "10.25976/tm9b-c550",
    //   name: "ASSINIBOINE RIVER AT HWY 8 BRIDGE",
    //   qlatitude: 51.5331,
    //   qlongitude: -101.8889,
    //   monitoringLocationType: "River/Stream",
    // },
    // {
    //   latitude: 49.00374984741211,
    //   longitude: -97.2238311767578,
    //   stationNo: "05OC001",
    //   stationName: "RED RIVER AT EMERSON",
    //   province: "MB",
    //   status: "Active",
    //   locationId: 790110,
    //   doi: "10.25976/tm9b-c550",
    //   name: "RED RIVER AT EMERSON",
    //   qlatitude: 49.0081,
    //   qlongitude: -97.2106,
    //   monitoringLocationType: "River/Stream",
    // },
  ];

  const disldata = [
    // {
    //   latitude: 53.16389083862305,
    //   longitude: -99.34889221191406,
    //   stationNo: "05KL001",
    //   stationName: "SASKATCHEWAN RIVER AT GRAND RAPIDS",
    //   province: "MB",
    //   status: "Active",
    //   locationId: 37077,
    //   doi: "10.25976/x5wn-0523",
    //   name: "SASKATCHEWAN RIVER AT GRAND RAPIDS",
    //   qlatitude: 53.16051,
    //   qlongitude: -99.26573,
    //   monitoringLocationType: "River/Stream",
    // },
    // {
    //   latitude: 50.567501068115234,
    //   longitude: -96.17749786376952,
    //   stationNo: "05PF069",
    //   stationName: "WINNIPEG RIVER AT PINE FALLS GENERATING STATION",
    //   province: "MB",
    //   status: "Active",
    //   locationId: 37078,
    //   doi: "10.25976/x5wn-0523",
    //   name: "WINNIPEG RIVER AT PINE FALLS GENERATING STATION",
    //   qlatitude: 50.56766,
    //   qlongitude: -96.17697,
    //   monitoringLocationType: "River/Stream",
    // },
    // {
    //   latitude: 51.56489181518555,
    //   longitude: -101.91655731201172,
    //   stationNo: "05MD004",
    //   stationName: "ASSINIBOINE RIVER AT KAMSACK",
    //   province: "SK",
    //   status: "Active",
    //   locationId: 790108,
    //   doi: "10.25976/tm9b-c550",
    //   name: "ASSINIBOINE RIVER AT KAMSACK",
    //   qlatitude: 51.5331,
    //   qlongitude: -101.8889,
    //   monitoringLocationType: "River/Stream",
    // },
    // {
    //   latitude: 49.00374984741211,
    //   longitude: -97.2238311767578,
    //   stationNo: "05OC001",
    //   stationName: "RED RIVER AT EMERSON",
    //   province: "MB",
    //   status: "Active",
    //   locationId: 790110,
    //   doi: "10.25976/tm9b-c550",
    //   name: "RED RIVER AT EMERSON, MANITOBA",
    //   qlatitude: 49.0081,
    //   qlongitude: -97.2106,
    //   monitoringLocationType: "River/Stream",
    // },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/wqs-data?hub=lakewinnipeg", {
          headers: {
            Accept: "application/json",
          },
        });
        if (response.data !== null) {
          setWQAutoComplete(response.data);
          setLoading(false);
        } else if (error !== null) {
          throw "No stations available";
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    const fetchDisData = async () => {
      try {
        const response = await axiosInstance.get(
          "/lw-discharge-station-data?",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.data) {
          setDISAutoComplete(response.data);
          setLoading(false);
          setError(null);
        } else {
          throw new Error("No Stations found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchDisData();
    fetchData();
  }, [error]);
  useEffect(() => {
    const makeList = async () => {
      let temp = [];
      // Don't rely on local type variable, use selected state directly
      console.log(selectedState);
      // First handle the station type detection and updates
      if (selectedState && boo) {
        const lastChar = selectedState.at(selectedState.length - 1);
        if (lastChar === "q") {
          const newState = selectedState.substring(0, selectedState.length - 3);
          setSelectedState(newState);
          setSelected("Concentration");
          setboo(false);
        } else if (lastChar === "s") {
          const newState = selectedState.substring(0, selectedState.length - 4);
          setSelectedState(newState);
          setSelected("Flow");
          setboo(false);
        } else if (lastChar === "d") {
          const newState = selectedState.substring(0, selectedState.length - 5);
          setSelectedState(newState);
          setSelected("Load");
          setboo(false);
        } else {
          setSelected("Concentration");
          setboo(false);
        }
      }

      // Handle list creation based on the current selected type
      if (
        selected === "Concentration" &&
        wqAutoComplete !== null &&
        wqAutoComplete.length > 0
      ) {
        temp = wqAutoComplete.map((value) => ({
          name: value.name + " - " + value.locationId,
          id: value.locationId,
          stationName: value.name,
          latitude: value.latitude,
          longitude: value.longitude,
        }));
      } else if (
        selected === "Flow" &&
        disAutoComplete !== null &&
        disAutoComplete.length > 0
      ) {
        temp = disAutoComplete.map((value) => ({
          name: value.stationName + " - " + value.stationNo,
          id: value.stationNo,
          stationName: value.stationName,
          latitude: value.latitude,
          longitude: value.longitude,
        }));
      } else if (selected === "Load") {
        temp = (dis)? disldata.map((value) => ({
          name1: value.stationName + " - " + value.stationNo,
          name: value.name + " - " + value.locationId,
          id: value.locationId,
          stationName: value.name,
          latitude: value.latitude,
          longitude: value.longitude,
          qlatitude: value.qlatitude,
          qlongitude: value.qlongitude,
        })) :
        wqldata.map((value) => ({
          name1: value.stationName + " - " + value.stationNo,
          name: value.name + " - " + value.locationId,
          id: value.locationId,
          stationName: value.name,
          latitude: value.latitude,
          longitude: value.longitude,
          qlatitude: value.qlatitude,
          qlongitude: value.qlongitude,
        }));
      }

      setList(temp);

      // Handle selection after list is updated
      if (selectedState) {
        const newVal = temp.find((item) => item.name === selectedState);
        if (newVal) {
          setSelect(newVal);
          setStation(newVal);
          setSelectedState(null);
        }
      }
    };

    makeList();
  }, [dis, disAutoComplete, wqAutoComplete, selected, selectedStation]);

  const graphs = [
    "Flux Q - Scatter Plot",
    "Conc Q - Scatter Plot",
    "Flux vs Time - Line Graph",
    "Conc vs Time - Line Graph",
    "Discharge vs Time - Line Graph",
    "Discharge vs Time - Box Plot",
    "Discharge vs Time - Violin Chart",
    "Water Quality vs Time - Box Plot",
    "Water Quality vs Time - Violin Chart",
    "Discharge vs Time - Violin Chart",

    //"Water Quality - Scatter Plot"
    //"Hydrograph",
  ];
  const characteristics = [
    "Ammonia",
    "Chloride",
    "Nitrate",
    "Nitrite",
    "Total carbon",
    "Total Nitrogen, mixed forms",
    "Total Phosphorus, mixed forms",
  ];
  const LoadGraphs = [
    "Saskatchewan River at Grand Rapids - TP - WRTDS",
    "Saskatchewan River at Grand Rapids - TN - WRTDS",
  ];
  const options = [
    { id: "Monthly", label: "Monthly" },
    { id: "Yearly", label: "Yearly" },
    { id: "Seasonal", label: "Seasonal" },
  ];
  const HandleGraph = (value) => {
    setShowGraph(value);
  };
  const HandleCharacteristic = (value) => {
    setShowCharacteristic(value);
  };
  const HandleLoad = (value) => {
    setShowLoad(value);
  };
  const handleClick = (button) => {
    if (button !== selected) {
      setStation("");
      setSelect(null);
      setSelected(button);
    }
  };

  const Generate = () => {
    if (showGraph !== "") {
      let newVal = {
        graph: showGraph,
        Station: Station.id,
        characteristic: showCharacteristic,
        load: showLoad,
        startDate: startDate,
        endDate: endDate,
        stationName: StationName,
        temporal: temp,
      };
      console.log(newVal);
      onGenerate(newVal);
    } else {
      return;
    }
  };
  const Clear = () => {
    onGenerate(null);
  };

  return (
    <div>
      <div className="inline-flex rounded-md shadow-sm">
        {buttons.map((button, index) => (
          <button
            key={button}
            onClick={() => handleClick(button)}
            className={`
            px-4 py-2 text-sm font-medium
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === buttons.length - 1 ? "rounded-r-lg" : ""}
            ${
              selected === button
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }
            border border-gray-300
            ${index !== 0 ? "border-l-0" : ""}
            focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          >
            {button.charAt(0).toUpperCase() + button.slice(1)}
          </button>
        ))}
      </div>
      {selected === "Concentration" ? (
        <div className="mt-5">
          {select !== null && select !== "" ? (
            <Autocomplete
              key={selectedStation + "C"}
              value={select}
              options={list || []} // Ensure options is never null
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                setSelect(newValue);
                setStation(newValue);
                setShowLoad("");
                setStationName(newValue?.stationName || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Station" 
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.name === value.name;
              }}
            />
          ) : (
            <Autocomplete
              key={"C"}
              options={list}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setStation(newValue);
                setShowLoad("");
                setStationName(newValue?.stationName || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Station"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
            />
          )}

          <div className="mt-5">
            <CustomSelect
              placeholder={"Select Graph"}
              ops={[
                "Water Quality vs Time - Box Plot",
                "Water Quality vs Time - Violin Chart",
              ]}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleGraph}
            />
          </div>
          <div className="mt-5">
            <CustomSelect
              placeholder={"Select Characteristic"}
              ops={characteristics}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleCharacteristic}
            />
          </div>
          {Station !== null && Station !== "" && (
            <div className="flex justify-evenly mt-5">
              <Link
                to={
                  "/map?lat=" +
                  Station.latitude +
                  "&&long=" +
                  Station.longitude +
                  "&&zoom=15"
                }
              >
                View on Map
              </Link>
              <Link to={"/wq/" + Station.id}>View Data</Link>
            </div>
          )}
        </div>
      ) : selected === "Flow" ? (
        <div className="mt-5">
          {select !== null && select !== "" ? (
            <Autocomplete
              key={selected + "F"} // Add this to force re-render when selected changes
              value={select}
              options={list || []} // Ensure options is never null
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                setSelect(newValue);
                setStation(newValue);
                setShowGraph("");
                setShowLoad("");
                setShowCharacteristic("");
                setStationName(newValue?.stationName || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Station"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.name === value.name;
              }}
            />
          ) : (
              <Autocomplete
                key={"F"}
                options={list}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setStation(newValue);
                  setShowGraph("");
                  setShowLoad("");
                  setShowCharacteristic("");
                  setStationName(newValue?.stationName || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter Station"
                    variant="outlined"
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
              />
          )}

          <div className="mt-5">
            <CustomSelect
              placeholder={"Select Graph"}
              ops={[
                "Discharge vs Time - Line Graph",
                "Discharge vs Time - Box Plot",
                "Discharge vs Time - Violin Chart",
              ]}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleGraph}
            />
          </div>
          {Station !== null && Station !== "" && (
            <div className="flex justify-evenly mt-5">
              <Link
                to={
                  "/map?lat=" +
                  Station.latitude +
                  "&&long=" +
                  Station.longitude +
                  "&&zoom=15"
                }
              >
                View on Map
              </Link>
              <Link to={"/dis-data/" + Station.id}>View Data</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                dis === true ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setDis(true)}
            >
              Discharge
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                dis === false ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setDis(false)}
            >
              Water Quality
            </button>
          </div>
          
          {select !== null && select !== "" ? (
            <Autocomplete
              key={selected + "LC"} // Add this to force re-render when selected changes
              value={select}
              options={list || []} // Ensure options is never null
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                setSelect(newValue);
                setStation(newValue);
                setStationName(newValue?.stationName || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Station"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option.name === value.name;
              }}
            />
          ) : (
            <Autocomplete
              key={"LC"}
              options={list}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setStation(newValue);
                setStationName(newValue?.name || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Station"
                  variant="outlined"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
            />
          )}

          <div className="mt-5">
            <CustomSelect
              placeholder={"Select Graph"}
              ops={[
                "Flux Q - Scatter Plot",
                "Conc Q - Scatter Plot",
                "Flux vs Time - Line Graph",
                "Conc vs Time - Line Graph",
              ]}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleGraph}
            />
          </div>
          <div className="mt-5">
            <CustomSelect
              placeholder={"Select Characteristic"}
              ops={[
                "Total Nitrogen, mixed forms",
                "Total Phosphorus, mixed forms",
              ]}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleLoad}
            />
            {/*<CustomSelect
              placeholder={"Select Model Type"}
              ops={["WRTDS"]}
              style={{ top: "7px", width: "90%", minWidth: "fit-content" }}
              onSelect={HandleLoad}
            />*/}
          </div>
        </div>
      )}

      <div>
        {(showGraph === "Water Quality vs Time - Box Plot" ||
          showGraph === "Discharge vs Time - Box Plot") && (
          <div className="flex-col gap-4 p-2">
            {options.map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center gap-2 cursor-pointer hover:bg-orange-300 p-2 rounded-md"
              >
                <input
                  type="radio"
                  name={"temporal" + ID}
                  id={id}
                  checked={temp === id}
                  onChange={() => setTemp(id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-black">{label}</span>
              </label>
            ))}
          </div>
        )}
        <div className="mt-10">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div>
                <Typography>From:</Typography>
                <DatePicker
                  views={["month", "year"]}
                  value={dayjs(startDate)}
                  onChange={(newValue) => {
                    if (newValue) setStartDate(newValue.format("YYYY-MM"));
                  }}
                  format="MM/YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "YYYY-MM",
                    },
                  }}
                />
              </div>
              <div>
                <Typography>To:</Typography>
                <DatePicker
                  views={["year", "month"]}
                  value={dayjs(endDate)}
                  onChange={(newValue) => {
                    if (newValue) setEndDate(newValue.format("YYYY-MM"));
                  }}
                  format="MM/YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "YYYY-MM",
                    },
                  }}
                />
              </div>
          </LocalizationProvider>

          <div className="w-4/5 flex mt-10 justify-around">
            <button
              className="hover:bg-blue-500 bg-blue-400 rounded-2xl px-2 py-2 font-bold"
              onClick={Generate}
            >
              Generate
            </button>
            <button
              className="hover:bg-red-500 bg-red-400 rounded-2xl px-3 py-2 font-bold"
              onClick={Clear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TypeCard;
