"use client";
import { GridLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="spinner">
      <GridLoader color="#374c69" speedMultiplier={1} />
    </div>
  );
};

export default Spinner;
