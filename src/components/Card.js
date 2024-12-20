import { HiChevronDown } from "react-icons/hi";
const Card = () => {
  return (
    <div className=" h-1/2 w-1/6 p-4  bg-white opacity-70">
      <div>
        <input
          type="text"
          placeholder="Search"
          className="border border-black p-2 ml-5 w-11/12"
        />
      </div>

      <div>
        <p className="text-xl mt-2 pt-2 font-semibold text-center">Filter</p>
        <div>
          <input type="checkbox" name="WQ Stations" id="wqs" />
          <label for="WQ Stations"> Hello</label>
          <div className="ml-10">
            <div className="flex justify-between">
              <p>Hello</p>
              <HiChevronDown className="text-xl" />
            </div>
            <div className="flex justify-between">
              <p>Hello</p>
            </div>
            <div className="flex justify-between">
              <p>Hello</p>
            </div>
            <div className="flex justify-between">
              <p>Hello</p>
            </div>
          </div>
          <input type="checkbox" name="WQ Stations" id="wqs" />
          <label for="WQ Stations"> Hello</label>
          <div className="ml-10 ">
            <div className="flex justify-between">
              <p>Hello</p>
              <p>arrow</p>
            </div>

            <div className="flex justify-between">
              <p>Hello</p>
              <p>arrow</p>
            </div>

            <div className="flex justify-between">
              <p>Hello</p>
              <p>arrow</p>
            </div>

            <div className="flex justify-between">
              <p>Hello</p>
              <p>arrow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
