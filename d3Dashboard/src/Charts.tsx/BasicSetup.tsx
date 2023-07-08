import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import alphabet from "../assets/data/alphabetFrequency.json";

const width = 800;
const height = 600;
const space = {
  marginLeft: 100,
  marginRight: 100,
  marginTop: 100,
  marginBottom: 100,
};

const BasicSetupForD3Charts = () => {
  const ref = useRef(null);
  const data = alphabet;

  const chart = () => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width:100%;height:100%");
  };

  useEffect(() => {
    chart();
  }, [data]);

  return (
    <div>
      <svg ref={ref} />
      <text />
    </div>
  );
};

export default BasicSetupForD3Charts;
