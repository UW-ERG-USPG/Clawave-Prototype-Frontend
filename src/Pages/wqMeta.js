import { useState, useEffect } from "react";
import axios from "axios";
import CustomSelect from "../components/Select";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
const BASE_URL = process.env.REACT_APP_TYPE=== 'production' 
  ? 'https://api-x0mb.onrender.com'
  : 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const WQMeta = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState(null);
  const [selectedother, setSelectedother] = useState(null);
  const [data, setData] = useState([]);
  const prov = [
    "atlantic",
    "greatlakes",
    "lakewinnipeg",
    "mackenzie",
    "pacific",
  ];
  const status = ["onGoing", "completed"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [sort, setSort] = useState(null);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/wqm-data?" +
            url +
            (url !== "" && searchUrl !== ""
              ? "&" + searchUrl
              : url === ""
              ? searchUrl
              : ""),
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (response.data) {
          setData(response.data);
          setLoading(false);
        } else {
          throw "No Stations found";
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, searchUrl]);

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
        newVal += "progressCode=" + encodeURIComponent(selected);
      }
      setUrl(newVal);
    };
    submithe();
  }, [selected, selectedother]);
  useEffect(() => {
    const AutoComplete = setTimeout(() => {
      console.log(search);
      // Autocomplete api call.
    }, 1000);
    return () => clearTimeout(AutoComplete);
  }, [search]);

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
  const HandleSubmit = (event) => {
    event.preventDefault();
    if (search === "") {
      return;
    }
    setSearchUrl("search=" + search);
  };

  const sortKey = (key, type) => {
    const sortedStations = [...data].sort((a, b) => {
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
    <div className="container mx-auto w-full">
      <p className="font-bold text-4xl ml-10">Water Quality Datasets</p>

      <div className="">
        {/*<div className="p-6">
          <form onSubmit={HandleSubmit}>
            <input
              type="search"
              autoComplete="on"
              placeholder="search by Dataset Name or DOI"
              className="w-full p-3 text-md font-semibold rounded-full  focus:outline"
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>*/}

        <div className="px-6 py-3 flex gap-20">
          <CustomSelect
            placeholder={"Select Progress Code"}

            ops={status}
            style={{ top: "7px", width: "20%", minWidth: "fit-content" }}
            onSelect={HandleChange}
          />
          <CustomSelect
            placeholder={"Select Hub"}
            ops={prov}
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
                          <span>DOI</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("doi", 1);
                              }}
                              key={"doi1"}
                              style={{
                                color: sort === "doi1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-500"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("doi", -1);
                              }}
                              style={{
                                color: sort === "doi-1" ? "red" : "",
                              }}
                              key={"doi-1"}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-5/12">
                        <div className="inline-flex">
                          <span>Dataset Name</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("datasetName", 1);
                              }}
                              style={{
                                color: sort === "datasetName1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("datasetName", -1);
                              }}
                              style={{
                                color: sort === "datasetName-1" ? "red" : "",
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
                          <span>Progress Code</span>
                          <div className="flex flex-col items-center ml-1">
                            <button
                              onClick={() => {
                                sortKey("progressCode", 1);
                              }}
                              style={{
                                color: sort === "progressCode1" ? "red" : "",
                              }}
                              className="-mb-2 hover:text-red-600"
                            >
                              <FaCaretUp className="text-md " />
                            </button>
                            <button
                              onClick={() => {
                                sortKey("progressCode", -1);
                              }}
                              style={{
                                color: sort === "progressCode-1" ? "red" : "",
                              }}
                              className="-mt-1 hover:text-red-600"
                            >
                              <FaCaretDown className="text-md" />
                            </button>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className="pl-4 pr-0  w-3/12">
                        <div className="inline-flex">
                          <span>Hubs</span>
                         {/* <span>
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
                          </span>*/}
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
                          <Link
                            to={"/wqs/" + item.doi.slice(9)}
                            className="cursor-pointer text-blue-500 underline"
                          >
                            {item.doi}
                          </Link>
                        </td>
                        <td className="px-4 py-4  ">{item.datasetName}</td>
                        <td className=" py-4  ">{item.progressCode}</td>
                        <td className=" px-4 py-4   ">
                          {item.hub.map((t, i) => t + " ")}
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
          <div>No Station Found</div>
        )}
      </div>
    </div>
  );
};

export default WQMeta;
