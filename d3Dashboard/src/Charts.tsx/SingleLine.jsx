/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import yahooStock from "../assets/data/yahooFin.json";

const width = 900;
const height = 600;
const space = {
    marginLeft: 100,
    marginRight: 100,
    marginTop: 100,
    marginBottom: 100,
};

const SingleLineChart = () => {
    const ref = useRef(null);
    const data = yahooStock;
    const parseDate = d3.timeParse("%Y-%m-%d")
    const formatDate = (date) => { return parseDate(date.split("T")[0]) };
    const parsedData = data.map((singleData) => ({ ...singleData, date: formatDate(singleData.date) }))

    const chart = () => {
        const svg = d3
            .select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "width:100%;height: auto; height: intrinsic;");

        const x = d3.scaleUtc(d3.extent(parsedData, d => d.date), [space.marginLeft, width - space.marginRight])
        const y = d3.scaleLinear([0, d3.max(parsedData, d => d.close)], [height - space.marginBottom, space.marginTop])

        const xAxis = d3.axisBottom(x).tickSizeOuter(0).ticks(width / 40)
        const yAxis = d3.axisLeft(y).tickSizeOuter(0)

        svg.append("g")
            .attr("transform", `translate(0, ${height - space.marginBottom})`)
            .call(xAxis)

        svg.append("g")
            .attr("transform", `translate(${space.marginLeft}, 0)`)
            .call(yAxis)

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close));

        svg.append("path")
            .datum(parsedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

    };

    useEffect(() => {
        chart();
    }, [parsedData]);

    return (
        <div>
            <svg ref={ref} />
            <text />
        </div>
    );
};

export default SingleLineChart;
