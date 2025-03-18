import { useState, useEffect } from "react";
import axios from "axios";

import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import CustomSelect from "../components/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack, Typography } from "@mui/material";
const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "http://198.168.187.196:8081"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const WQData = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [sort, setSort] = useState(null);
  const [selected, setSelected] = useState(null);
  const [startDate, setStartDate] = useState("2000-01-01");
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const nutrients = [
    "Total Nitrogen, mixed forms",
    "Total Phosphorus, mixed forms",
    "Total carbon",
    "Chloride",
    "Ammonia",
    "Nitrate",
    "Nitrite",
  ];

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await axiosInstance.get(`/wqs-data/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });
        console.log(response.data);
        if (response.data !== null) {
          setMeta(response.data);
          setLoading(false);
        } else {
          throw new Error("Invalid Station");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchMeta();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/wq-data/${id}?` + url, {
          headers: {
            Accept: "application/json",
          },
        });
        console.log(response.data);
        if (response.data !== null) {
          setData(response.data);
          setLoading(false);
          setError(null);
        } else if (error === null) {
          throw new Error("No data in Range");
        } else {
          return;
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [url, id, error]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data ? data.slice(indexOfFirstRow, indexOfLastRow) : [];
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const sortKey = (key, type) => {
    const sortedStations = [...(data || [])].sort((a, b) => {
      if (key === "value") {
        if (type === 1) {
          return a[key] - b[key]; // Use localeCompare for strings
        } else {
          return b[key] - a[key]; // Use localeCompare for strings
        }
      }
      if (type === 1) {
        return a[key].localeCompare(b[key]); // Use localeCompare for strings
      } else {
        return b[key].localeCompare(a[key]); // Use localeCompare for strings
      }
    });
    if (type === 1) {
      setSort(key + "1");
    } else {
      setSort(key + "-1");
    }

    setData(sortedStations);
  };

  useEffect(() => {
    const submithe = () => {
      let newVal = "";
      let check = false;
      let newVal1 = "";
      let check1 = false;
      if (selected !== "" && Array.isArray(selected) && selected.length > 0) {
        newVal = "nutrients=";
        let newVals = "";
        for (let i = 0; i < selected.length - 1; i++) {
          newVals += selected[i] + ";";
        }
        newVals += selected[selected.length - 1];
        newVal += encodeURIComponent(newVals);
        check = true;
      }
      if (startDate !== "" && endDate !== "" && startDate < endDate) {
        newVal1 = "startdate=" + startDate + "&enddate=" + endDate;
        check1 = true;
      } else if (startDate === "") {
        newVal1 = "enddate=" + endDate;
        check1 = true;
      } else if (endDate === "") {
        newVal1 = "startdate=" + startDate;
        check1 = true;
      } else {
        newVal1 = "";
      }
      if (check && check1) {
        setUrl(newVal + "&" + newVal1);
      } else if (check) {
        setUrl(newVal);
      } else if (check1) {
        setUrl(newVal1);
      } else {
        setUrl("");
      }
    };
    submithe();
    setCurrentPage(1);
  }, [selected, startDate, endDate]);

  const HandleChange1 = (value) => {
    setSelected(value);
  };

  return (
    <div className="container mx-auto w-full ">
      <p className="font-bold text-4xl ml-10">{meta.name}</p>
      <div className="flex w-1/2  justify-between mt-5 ">
        <div className="ml-16 font-semibold text-xl">
          <div className="flex">
            <p>DOI: </p>
            <Link
              to={"/wqs/" + meta?.doi?.slice(9)}
              className="cursor-pointer text-blue-600 underline"
            >
              {meta.doi}
            </Link>{" "}
          </div>
          <p>Location ID: {meta.locationId} </p>
          <p>
            Latitude:{" "}
            {typeof meta.latitude === "number"
              ? meta.latitude.toFixed(4)
              : "N/A"}
          </p>
          <p>
            Longitude:{" "}
            {typeof meta.longitude === "number"
              ? meta.longitude.toFixed(4)
              : "N/A"}
          </p>
          <p>Location Type: {meta.monitoringLocationType} </p>
          <p>Hub: {meta.hub}</p>
        </div>
        <div className="grid mr-16 ">
          <Link
            to={"/graph?station=" + meta.name + " - " + meta.locationId + " wq"}
            className="font-semibold text-xl text-blue-500"
          >
            Plot Graph
          </Link>
          <Link
            to={
              "/map?lat=" +
              meta.latitude +
              "&&long=" +
              meta.longitude +
              "&&zoom=15"
            }
            className="font-semibold text-xl text-blue-500"
          >
            View on Map
          </Link>
        </div>
      </div>
      <div className="">
        <div className="px-6 py-3 flex gap-20">
          <CustomSelect
            placeholder={"Select Characteristic Names"}
            ops={nutrients}
            isMulti={true}
            style={{ top: "7px", width: "20%" }}
            onSelect={HandleChange1}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Start Date:</Typography>
              <DatePicker
                value={dayjs(startDate)} // Ensure it's a dayjs object
                onChange={(newValue) => {
                  if (newValue) setStartDate(newValue.format("YYYY-MM-DD"));
                }}
                slotProps={{ textField: { size: "small" } }}
              />

              <Typography>End Date:</Typography>
              <DatePicker
                value={dayjs(endDate)} // Ensure it's a dayjs object
                onChange={(newValue) => {
                  if (newValue) setEndDate(newValue.format("YYYY-MM-DD"));
                }}
                slotProps={{ textField: { size: "small" } }}
              />
            </Stack>
          </LocalizationProvider>
        </div>

        {!loading && error === null ? (
          <div className=" p-6">
            <div className="shadow-md sm:rounded-lg">
              <div
                className="overflow-y-auto overflow-x-auto"
                style={{ minHeight: "40vh", maxHeight: "60vh" }}
              >
                <table className="w-full text-center text-black table-fixed">
                  <thead className="text-xl text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="py-4  w-1/12 ">
                        Index
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-2/12 ">
                        <div className="inline-flex">
                          <span>Date</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("date", 1);
                              }}
                              key={"date1"}
                              style={{
                                color: sort === "date1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-500"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("date", -1);
                              }}
                              style={{
                                color: sort === "date-1" ? "red" : "",
                              }}
                              key={"date-1"}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-3/12">
                        <div className="inline-flex">
                          Characteristic Name
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("characteristicName", 1);
                              }}
                              style={{
                                color:
                                  sort === "characterisiticName1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("characteristicName", -1);
                              }}
                              style={{
                                color:
                                  sort === "characteristicName-1" ? "red" : "",
                              }}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-2/12">
                        <div className="inline-flex">
                          <span>Method Speciation</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("methodSpeciation", 1);
                              }}
                              style={{
                                color:
                                  sort === "methodSpeciation1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("methodSpeciation", -1);
                              }}
                              style={{
                                color:
                                  sort === "methodSpeciation-1" ? "red" : "",
                              }}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-2/12">
                        <div className="inline-flex">
                          <span>Result Value</span>
                          <span>
                            <div className="flex flex-col items-center ml-1">
                              <button
                                onClick={() => {
                                  sortKey("value", 1);
                                }}
                                style={{
                                  color: sort === "value1" ? "red" : "",
                                }}
                                className="-mb-2 hover:text-red-600"
                              >
                                <FaCaretUp className="text-md " />
                              </button>
                              <button
                                onClick={() => {
                                  sortKey("value", -1);
                                }}
                                style={{
                                  color: sort === "value-1" ? "red" : "",
                                }}
                                className="-mt-1 hover:text-red-600"
                              >
                                <FaCaretDown className="text-md" />
                              </button>
                            </div>
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {currentRows.map((item, index) => (
                      <tr
                        key={index}
                        className="odd:bg-gray-300 even:bg-slate-200"
                      >
                        <td className=" py-4 ">
                          {indexOfFirstRow + index + 1}
                        </td>
                        <td className=" py-4 ">{item.date}</td>
                        <td className="px-4 py-4  ">
                          {item.characteristicName}
                          {item.resultSampleFraction !== ""
                            ? ", " + item.resultSampleFraction
                            : ""}
                        </td>
                        <td className=" py-4  ">{item.methodSpeciation} </td>

                        <td className=" px-4 py-4   ">
                          {item.value}{" "}
                          {item.resultUnit === "" || item.resultUnit === "None"
                            ? ""
                            : item.resultUnit === "deg C"
                            ? "\u00B0C"
                            : item.resultUnit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <label htmlFor="rowsPerPage" className="mr-2">
                  Rows per page:
                </label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {[10, 20, 50, 100].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1 || totalPages === 0}
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-black"
                >
                  Previous
                </button>
                {totalPages > 0 ? (
                  <span className="mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                ) : (
                  <span className="mx-2">
                    Page {0} of {totalPages}
                  </span>
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:text-black"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : error === null ? (
          <>
            <p>loading</p>
          </>
        ) : (
          <div>{error.message}</div>
        )}
      </div>
    </div>
  );
};

export default WQData;
