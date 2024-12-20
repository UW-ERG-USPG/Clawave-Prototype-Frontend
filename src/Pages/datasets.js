import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_TYPE=== 'production' 
  ? 'https://api-jemx.onrender.com'
  : 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
const WQSet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/wqm-data", {
          headers: {
            Accept: "application/json",
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="container mx-auto w-full bg-red-500">
      <p className="font-bold text-4xl ml-10">WQ dataset</p>
      <div className="p-6">
        <input type="text" />
        <select name="Province" id="Province"></select>
        <select name="Status" id="Status"></select>
        <button>Filter</button>
      </div>

      <div className="bg-cyan-100 p-4">
        <div className="shadow-md sm:rounded-lg">
          <div
            className="overflow-y-auto overflow-x-auto"
            style={{ maxHeight: "70vh" }}
          >
            <table className="w-full text-center text-black px-5">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="py-4  ">
                    Index
                  </th>
                  <th scope="col" className="py-4 ">
                    DOI
                  </th>
                  <th scope="col" className=" py-4  ">
                    DatasetName
                  </th>

                  <th scope="col" className=" py-4 ">
                    Progress Code
                  </th>

                  <th scope="col" className=" py-4 ">
                    Hub
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => (
                  <tr
                    key={index}
                    className="even:bg-slate-400 odd:bg-slate-200"
                  >
                    <td className=" py-4 ">{indexOfFirstRow + index + 1}</td>
                    <td className="px-4 py-4 text-blue-600 font-semibold underline ">
                      {item.doi}
                    </td>
                    <td className="px-0 py-4  ">{item.datasetName}</td>
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
              disabled={currentPage === 1}
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WQSet;
