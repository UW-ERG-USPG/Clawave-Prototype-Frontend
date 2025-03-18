import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

const ScatterPlot = ({
  data,
  width,
  height,
  xLabel,
  yLabel,
  title,
  startDate,
  endDate,
  station
}) => {
  const svgRef = useRef();
  const validData = useMemo(() => {
    return data
      .filter((item) => {
        const isValidDate = !isNaN(new Date(item.date).getTime());

        if (!isValidDate) return false;
        if (startDate && endDate) {
          return startDate <= item.date && item.date <= endDate;
        } else if (startDate) {
          return startDate <= item.date;
        } else if (endDate) {
          return item.date <= endDate;
        }
        return true;
      })
      .map((item) => ({
        date: new Date(item.date),
        discharge: parseFloat(item.discharge),
        flux: parseFloat(item.flux),
      }))
      .sort((a, b) => a.date - b.date);
  }, [data, startDate, endDate]);
  useEffect(() => {
    const margin = { top: 70, right: 30, left: 100, bottom: 50 };
    const Innerwidth = width - margin.left - margin.right;
    const Innerheight = height - margin.top - margin.bottom;
    // Clear previous SVG

    // Create SVG
    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([
        Math.min(0, d3.min(validData, (d) => d.discharge)), 
        d3.max(validData, (d) => d.discharge)
      ])
      .range([0, Innerwidth]);
  
  const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(0, d3.min(validData, (d) => d.flux)), 
        d3.max(validData, (d) => d.flux)
      ])
      .range([Innerheight, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${Innerheight})`)
      .call(xAxis)
      .style("font-size", "14px");

    g.append("g").call(yAxis).style("font-size", "14px");

    // Points
    g.selectAll("circle")
      .data(validData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.discharge))
      .attr("cy", (d) => yScale(d.flux))
      .attr("r", 2)
      .attr("fill", "#4299e1")
      .attr("class", "hover:opacity-75 transition-opacity duration-200");
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text(title);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(xLabel);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 3)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(yLabel);
  }, [validData, yLabel, xLabel, title, height, width]);

  return (
    <div className="mt-4 ml-4 pb-4 rounded-xl bg-white w-fit  relative">
      <svg ref={svgRef} width={width} height={height} className=" " />
    </div>
  );
};

export default ScatterPlot;
