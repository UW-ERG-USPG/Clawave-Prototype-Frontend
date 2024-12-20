import { useState, useEffect } from "react";
import axios from "axios";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import CustomSelect from "../components/Select";
const BASE_URL =
  process.env.REACT_APP_TYPE === "production"
    ? "https://api-jemx.onrender.com"
    : "http://localhost:8080";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const WQStation = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState(null); // use for time range
  const [selectedother, setSelectedother] = useState(null); // use for discharge range
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [sort, setSort] = useState(null);
  const stations = [];
  const hubs = [
    "atlantic",
    "greatlakes",
    "lakewinnipeg",
    "mackenzie",
    "pacific",
  ];

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await axiosInstance.get(`/wqm-data/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (response.data !== null) {
          setMeta(response.data);
          setLoading(false);
        } else {
          throw "Invalid dataset";
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
        const response = await axiosInstance.get(
          "/wqs-data?doi=" + id + (url ? "&" + url : ""),
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log(response.data);
        if (response.data !== null) {
          setData(response.data);
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

    fetchData();
  }, [url, id]);

  useEffect(() => {
    const submithe = () => {
      let newVal = "";
      if (
        selectedother !== "" &&
        Array.isArray(selectedother) &&
        selectedother.length > 0
      ) {
        newVal = "hub=";
        let newVals = "";
        for (let i = 0; i < selectedother.length - 1; i++) {
          newVals += selectedother[i] + ",";
        }
        newVals += selectedother[selectedother.length - 1];
        newVal += encodeURIComponent(newVals);
      }

      if (selected !== "" && selected !== null) {
        if (newVal !== "") newVal += "&";
        newVal += "monitoringlocationtype=" + encodeURIComponent(selected);
      }
      setUrl(newVal);
    };
    submithe();
  }, [selected, selectedother]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data ? data.slice(indexOfFirstRow, indexOfLastRow) : 0;
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const HandleChange = (value) => {
    setSelected(value);
  };
  const HandleChange1 = (value) => {
    setSelectedother(value);
  };
  const sortKey = (key, type) => {
    const sortedStations = [...(data || [])].sort((a, b) => {
      if (key === "locationId") {
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
      <p className="font-bold text-4xl ml-10">{meta.datasetName}</p>
      <div className="ml-16 font-semibold text-xl mt-5">
        <p>DOI: {meta.doi} </p>
        <p>Data Collection Organization: {meta.dataCollectionOrganization} </p>
        <p>
          Funding Source:{" "}
          {meta.fundingSource !== "" && meta.fundingSource !== null
            ? meta.fundingSource
            : "N/A"}{" "}
        </p>
        <p>
          Progress Code:
          {meta.progressCode !== "" && meta.progressCode !== null
            ? meta.progressCode
            : "N/A"}
        </p>
        <p>
          Maintenance Frequency:{" "}
          {meta.maintenanceFrequencyCode !== "" &&
          meta.maintenanceFrequencyCode !== null
            ? meta.maintenanceFrequencyCode
            : "N/A"}
        </p>
      </div>
      <div className="">
        <div className="px-6 py-3 flex gap-20">
          <CustomSelect
            placeholder={"Select Station Type"}
            ops={stations}
            style={{ top: "7px", width: "20%", minWidth: "fit-content" }}
            onSelect={HandleChange}
          />
          <CustomSelect
            placeholder={"Select Hubs"}
            ops={hubs}
            isMulti={true}
            style={{ top: "7px", width: "20%", minWidth: "fit-content" }}
            onSelect={HandleChange1}
          />
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
                          <span>Location ID</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("locationId", 1);
                              }}
                              key={"locationId1"}
                              style={{
                                color: sort === "locationId1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-500"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("locationId", -1);
                              }}
                              style={{
                                color: sort === "locationId-1" ? "red" : "",
                              }}
                              key={"locationId-1"}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-4/12">
                        <div className="inline-flex">
                          Station Name
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("name", 1);
                              }}
                              style={{
                                color: sort === "name1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("name", -1);
                              }}
                              style={{
                                color: sort === "name-1" ? "red" : "",
                              }}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-1/12">
                        <div className="inline-flex">
                          <span>Station Type</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("monitoringLocationType", 1);
                              }}
                              style={{
                                color:
                                  sort === "monitoringLocationType1"
                                    ? "red"
                                    : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("monitoringLocationType", -1);
                              }}
                              style={{
                                color:
                                  sort === "monitoringLocationType-1"
                                    ? "red"
                                    : "",
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
                          <span>Hubs</span>
                          <span>
                            <div className="flex flex-col items-center ml-1">
                              <button
                                onClick={() => {
                                  sortKey("hub", 1);
                                }}
                                style={{
                                  color: sort === "hub1" ? "red" : "",
                                }}
                                className="-mb-2 hover:text-red-600"
                              >
                                <FaCaretUp className="text-md " />
                              </button>
                              <button
                                onClick={() => {
                                  sortKey("hub", -1);
                                }}
                                style={{
                                  color: sort === "hub-1" ? "red" : "",
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
                        <td className=" py-4 ">
                          {item.hub === "lakewinnipeg" ? (
                            <Link
                              to={"/wq/" + item.locationId}
                              className={
                                " text-blue-500 underline cursor-pointer"
                              }
                            >
                              {item.locationId}
                            </Link>
                          ) : (
                            item.locationId
                          )}
                        </td>
                        <td className="px-4 py-4  ">{item.name}</td>
                        <td className=" py-4  ">
                          {item.monitoringLocationType}
                        </td>

                        <td className=" px-4 py-4   ">{item.hub}</td>
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

export default WQStation;
