import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import populationByAge from "../assets/data/populationByAge.json";

const width = 1000;
const height = 600;
const space = {
  marginLeft: 50,
  marginRight: 50,
  marginTop: 50,
  marginBottom: 50,
};

const StackedBarCharts = () => {
  const ref = useRef(null);
  const data = populationByAge;

  const chart = () => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "width:100%;height:100%");

    const series = d3
      .stack()
      .keys(d3.union(data.map((d) => d.age)))
      .value(([d, D], key) => {
        return D.get(key).population;
      })(
        d3.index(
          data,
          (d) => d.state, // first group by state
          (d) => d.age // second group by age
        )
        // result [{state:{age{}}}]
      );

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.state))
      .range([space.marginLeft, width - space.marginRight])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (d) => { return d3.max(d, d => { return d[1] }) })])
      .rangeRound([height - space.marginBottom, space.marginTop]);

    const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");

    const rect = svg.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(series)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(D => D)
      .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("width", d => x.bandwidth())
      .attr("height", d => y(d[0]) - y(d[1]))


    const xAxis = d3.axisBottom(x);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - space.marginBottom})`)
      .call(xAxis)
      .call((g) => g.selectAll(".domain").remove());

    const format = d3.formatPrefix("+0.1", 1e6);
    const yAxis = d3.axisLeft(y).ticks(null, "s");
    svg
      .append("g")
      .attr("transform", `translate(${space.marginLeft}, 0)`)
      .call(yAxis);

    // console.log("series", series);
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

export default StackedBarCharts;
