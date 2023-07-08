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

const BarCharts = () => {
  const ref = useRef(null);
  const data = alphabet;

  const chart = () => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width:100%;height:100%")
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", 12)
      .attr("fill", "blue")
      .text("Frequency of Alphabets");

    const groupedData = d3.groupSort(
      data,
      ([d]) => -d.frequency,
      (d) => d.letter
    );

    const x = d3.scaleBand().domain(groupedData).range([space.marginLeft, width - space.marginRight]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.frequency)]).range([height - space.marginBottom, space.marginTop]);


    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", d => x(d.letter))
      .attr("y", d => y(d.frequency))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.frequency))

    svg.append("g").
      selectAll()
      .data(data)
      .join("text")
      .attr("x", d => x(d.letter))
      .attr("y", d => y(d.frequency) - 10)
      .attr("dy", 22)
      .attr("fill", "steelblue")
      .attr("font-size", 12)
      .attr("transform", d => `rotate(-90, ${x(d.letter)}, ${y(d.frequency) - 2})`)
      .text(d => d.frequency)

    const xAxis = d3.axisBottom(x).tickSizeOuter(0).tickSizeInner(2)
    svg.append("g")
      .attr("transform", `translate(0,${height - space.marginBottom})`)
      .call(xAxis)
      .attr("fill", "blue")
      .call(g => g.append("text")
        .attr("x", width / 2)
        .attr("y", space.marginBottom / 2)
        .attr("fill", "steelblue")
        .text("Alphabets")
      )

    const yAxis = d3.axisLeft(y)
    svg.append("g")
      .attr("transform", `translate(${space.marginLeft}, 0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", 0)
        .attr("y", space.marginTop)
        .attr("fill", "steelblue")
        .text("Frequency %"))

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

export default BarCharts;
