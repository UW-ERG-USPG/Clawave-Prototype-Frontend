import { useEffect, useState, useRef } from "react";
import { HiChevronDown } from "react-icons/hi";
import { IoMdCheckmark } from "react-icons/io";
const CustomSelect = ({ placeholder, ops, isMulti, style, onSelect }) => {
  const [Value, setValue] = useState(placeholder);
  const [SelectedValue, setSelectedValue] = useState(isMulti ? [] : null);
  const [options, setOptions] = useState(null);
  const [render, setRender] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    setOptions(ops);
  }, [ops]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setRender(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  function HandleClick() {
    setRender(!render);
  }

  function Selecta(t) {
    let newVal;
    if (isMulti) {
      newVal = [...SelectedValue, t].sort();
      if (SelectedValue.findIndex((o) => o === t) >= 0) {
        newVal = SelectedValue.filter((o) => o !== t);
      }
      if (newVal.length === 0) {
        newVal = placeholder;
        setSelectedValue([]);
        onSelect("");
      } else {
        setSelectedValue(newVal);
        onSelect(newVal);
      }
    } else {
      if (Value === t) {
        newVal = placeholder;
        onSelect("");
      } else {
        newVal = t;
        onSelect(newVal);
      }
      setSelectedValue(newVal);
    }
    setValue(newVal);
  }

  const isSelected = (t, i) => {
    return (
      <div key={i}>
        {isMulti ? (
          <button
            className="w-full bg-white text-start hover:bg-slate-400 "
            onClick={() => Selecta(t)}
          >
            <div className="flex py-1 pl-5  gap-2">
              {SelectedValue.findIndex((o) => o === t) >= 0 && (
                <IoMdCheckmark className="text-blue-500 text-md mt-1 " />
              )}
              {" " + t}
            </div>
          </button>
        ) : (
          <button
            className="w-full bg-white text-start hover:bg-slate-400 "
            onClick={() => {
              Selecta(t);
            }}
          >
            <div className="flex py-1 pl-5  gap-2">
              {SelectedValue === t && (
                <IoMdCheckmark className="text-blue-500 text-md mt-1" />
              )}{" "}
              {t}
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div ref={inputRef} className="relative" style={style}>
      <div className="flex h-8 border-2 border-black pl-5 bg-orange-400 text-lg font-bold">
        <p className="w-full overflow-hidden ">
          {Array.isArray(Value) ? Value.map((t, i) => t + " ") : Value}
        </p>
        <button onClick={HandleClick}>
          <HiChevronDown className="text-xl font-bold" />
        </button>
      </div>
      {render && (
        <div
          className="flex w-full border-x-2 border-b-2 border-black  flex-col absolute z-10 overflow-y-auto "
          style={{ maxHeight: "40vh" }}
        >
          {options.map((t, i) => isSelected(t, i))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
