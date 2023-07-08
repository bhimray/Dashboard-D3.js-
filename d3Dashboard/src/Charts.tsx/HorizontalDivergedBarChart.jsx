import React, { useRef, useEffect, useState } from 'react'
import * as d3 from "d3";
import population from "../assets/data/states.json";

const width = 1200;
const height = 1000;
const space = {
    marginLeft: 100,
    marginRight: 100,
    marginTop: 100,
    marginBottom: 100,
};

const HorizontalDivergedBarChart = () => {
    const ref = useRef(null);
    const [valueType, setValueType] = useState("absolute");
    const data = population.map((eachData) => {
        return {
            ...eachData,
            value: valueType === "absolute" ? eachData["2019"] - eachData["2010"] : (eachData["2019"] - eachData["2010"]) / eachData["2010"]
        }
    });
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
            .text("Comparison of Population (2010 - 2019)");

        const x = d3.scaleLinear()
            .domain(d3.extent(data.map(d => d.value)))
            .rangeRound([space.marginLeft, width - space.marginRight])

        const y = d3.scaleBand()
            .domain(data.map(d => d.State))
            .rangeRound([space.marginTop, height - space.marginBottom])
            .padding(0.2);

        const colors = d3.schemeRdBu[5]
        svg.append("g")
            .selectAll()
            .data(data)
            .join("rect")
            .attr("fill", d => d.value > 0 ? colors[3] : colors[4])
            .attr("x", d => { return x(Math.min(d.value, 0)) })
            .attr("y", d => y(d.State))
            .attr("width", d => Math.abs(x(d.value) - x(0)))
            .attr("height", y.bandwidth)

        const format = d3.format(valueType === "absolute" ? "+,d" : "0.1%")
        svg.append("g")
            .selectAll()
            .data(data)
            .join("text")
            .attr("text-anchor", d => d.value > 0 ? "start" : "end")
            .attr("x", d => x(d.value) + Math.sign(d.value) * 5)
            .attr("y", d => y(d.State) + (y.bandwidth() / 2))
            .attr("dy", "0.25em")
            .attr("font-size", 12)
            .attr("fill", "steelblue")
            .text(d => format(d.value))

        const xTickFormat = valueType === "absolute" ? d3.formatPrefix("+0.1", 1e6) : d3.format("+0.1%")
        const xAxis = d3.axisTop(x).ticks(width / 50).tickFormat(xTickFormat)
        svg.append("g")
            .attr("transform", `translate(0, ${space.marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll("text").attr("fill", "steelblue"))
            .call(g => g.selectAll(".tick line")
                .clone()
                .attr("y2", height - space.marginBottom - space.marginTop).
                attr("opacity", 0.1)
            )

        const yAxis = d3.axisLeft(y).tickSize(0)
        svg.append("g")
            .attr("transform", `translate(${x(0)}, 0)`)
            .call(yAxis)
            .call(g => g.selectAll("text").attr("fill", (d, i) => data[i].value > 0 ? "steelblue" : colors[4]))
            .call(g => g.selectAll(".tick text").filter((d, i) => data[i].value < 0)
                .attr("text-anchor", "start")
                .attr("x", 7))

    }

    useEffect(() => {
        chart();
    }, [data]);


    return (
        <div>
            <svg ref={ref} />
        </div>
    )
}

export default HorizontalDivergedBarChart