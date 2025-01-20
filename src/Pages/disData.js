import { useState, useEffect } from "react";
import axios from "axios";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "https://api-x0mb.onrender.com"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
const DisData = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [sort, setSort] = useState(null);
  const [startDate, setStartDate] = useState(
    dayjs("2000-01-01").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await axiosInstance.get(
          `/discharge-data/${id}?` + url,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.data !== null) {
          setData(response.data);
          setLoading(false);
        } else {
          throw "No Discharge data in range";
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };
    const fetchMeta = async () => {
      try {
        const response = await axiosInstance.get(
          `/discharge-station-data/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.data !== null) {
          setMeta(response.data);
          setLoading(false);
        } else {
          throw "Invalid Station";
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
    fetchMeta();
  }, [url, id]);

  useEffect(() => {
    const submithe = () => {
      let newVal = "";
      if (startDate !== "" && endDate !== "" && startDate < endDate) {
        newVal = "startdate=" + startDate + "&enddate=" + endDate;
      } else if (startDate === "") {
        newVal = "enddate=" + endDate;
      } else if (endDate === "") {
        newVal = "startdate=" + startDate;
      } else {
        return;
      }
      setUrl(newVal);
    };
    submithe();
  }, [startDate, endDate]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data ? data.slice(indexOfFirstRow, indexOfLastRow) : 0;
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const HandleChange = (value) => {
    setStartDate(value);
  };
  const HandleChange1 = (value) => {
    setEndDate(value);
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

  return (
    <div className="container mx-auto w-full ">
      <p className="font-bold text-4xl ml-10">{meta.stationName}</p>
      <div className="flex w-1/2  justify-between mt-5 ">
        <div className="ml-16 font-semibold text-xl ">
          <p>Station No: {meta.stationNo} </p>
          <p>Province: {meta.province} </p>
          <p>Status: {meta.status} </p>
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
        </div>
        <div className="grid mr-16 ">
          <Link
            to={
              "/graph?station=" +
              meta.stationName +
              " - " +
              meta.stationNo +
              " dis"
            }
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
                      <th scope="col" className="py-4  w-1/6 ">
                        Index
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-2/6 ">
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
                      <th scope="col" className="pl-4 pr-0  w-1/6">
                        <div className="inline-flex">
                          <span>
                            Discharge(<span className="lowercase">m</span>
                            <sup>3</sup>/s)
                          </span>
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
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-2/6">
                        <div className="inline-flex">
                          <span>Discharge Symbol</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("dischargeSymbol", 1);
                              }}
                              style={{
                                color: sort === "dischargeSymbol1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("dischargeSymbol", -1);
                              }}
                              style={{
                                color:
                                  sort === "dischargeSymbol-1" ? "red" : "",
                              }}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
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
                        <td className="px-4 py-4  ">{item.value}</td>
                        <td className=" py-4  ">{item.dischargeSymbol}</td>
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
          <div>{error}</div>
        )}
      </div>
    </div>
  );
};

export default DisData;
