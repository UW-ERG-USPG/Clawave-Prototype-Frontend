import { useState } from "react";
import WQMeta from "./wqMeta";
import DiStation from "./distation";

const Data = () => {
  const [WQ, setWQ] = useState(false);
  const [DIS, setDIS] = useState(false);

  return (
    <>
      {!WQ && !DIS && (
        <div className="container flex justify-center items-center h-96 mx-auto relative top-40">
          <button
            onClick={() => setWQ(true)}
            className="px-12 py-6 text-xl font-bold bg-blue-500 hover:bg-blue-900 text-white rounded disabled:bg-gray-300"
          >
            Water Quality
          </button>
          <button
            onClick={() => setDIS(true)}
            className="px-12 py-6 text-xl ml-10 font-bold bg-blue-500 hover:bg-blue-900 text-white rounded disabled:bg-gray-300"
          >
            Discharge
          </button>
        </div>
      )}

      {WQ && (
        <>
          <button onClick={() => setWQ(!WQ)} className="px-12 py-6 text-xl bg-blue-500 hover:bg-blue-900 text-white">
            back
          </button>
          <WQMeta/>
        </>
      )}
      {DIS && (
        <>
        <button onClick={() => setDIS(!DIS)} className="px-12 py-6 text-xl bg-blue-500 hover:bg-blue-900 text-white">
          back
        </button>
        <DiStation/>
        </>
      )}
    </>
  );
};

export default Data;
