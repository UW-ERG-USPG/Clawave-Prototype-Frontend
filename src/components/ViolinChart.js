import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";

const ViolinChart = ({
  data,
  title,
  xLabel,
  yLabel,
  width,
  height,
  startDate,
  endDate,
  temporal,
  station
}) => {
  const [error, setError] = useState(null);
  const svgRef = useRef();

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const parseDate = d3.timeParse("%Y-%m-%d");

    return data
      .filter((item) => {
        const isValidDate = !isNaN(new Date(item.date).getTime());
        const isValidValue = !isNaN(parseFloat(item.value));

        if (!isValidDate || !isValidValue) return false;
        if (startDate && endDate) {
          return startDate <= item.date && item.date <= endDate;
        } else if (startDate) {
          return startDate <= item.date;
        } else if (endDate) {
          return item.date <= endDate;
        }

        return true;
      })
      .reduce((acc, d) => {
        const parsedDate = parseDate(d.date);
        if (parsedDate && !isNaN(d.value)) {
          acc.push({
            date: parsedDate,
            year: parsedDate.getFullYear(),
            value: +d.value,
          });
        }
        return acc;
      }, []);
  }, [data, startDate, endDate]);

  useEffect(() => {
    if (!processedData || processedData.length === 0) {
      setError("No valid data to display");
      return;
    }

    setError(null);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 70, right: 30, bottom: 70, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const groupedData = d3.group(processedData, (d) => d.year);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain([...groupedData.keys()])
      .range([0, chartWidth])
      .padding(0.05);

    const globalYScale = d3
      .scaleLinear()
      .domain(d3.extent(processedData, (d) => d.value))
      .range([chartHeight, 0])
      .nice();

    // Create violins
    const violins = Array.from(groupedData, ([key, values]) => {
      const violinYScale = d3
        .scaleLinear()
        .domain(d3.extent(values, (d) => d.value))
        .range([chartHeight, 0])
        .nice();

      const histogram = d3
        .bin()
        .value((d) => d.value)
        .domain(violinYScale.domain())
        .thresholds(violinYScale.ticks(40));

      const bins = histogram(values);

      return {
        year: key,
        bins: bins,
        yScale: violinYScale,
      };
    });

    const maxBinLength = d3.max(violins, (v) =>
      d3.max(v.bins, (b) => b.length)
    );

    const binXScale = d3
      .scaleLinear()
      .range([0, xScale.bandwidth() / 2])
      .domain([0, maxBinLength]);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw violins
    chart
      .selectAll(".violin")
      .data(violins)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.year) + xScale.bandwidth() / 2}, 0)`
      )
      .each(function (violinData) {
        const g = d3.select(this);
        const binMin = d3.min(violinData.bins, (b) => b.x0);
        const binMax = d3.max(violinData.bins, (b) => b.x1);
        g.append("path")
          .datum(violinData.bins)
          .attr("fill", "#69b3a2")
          .attr("stroke", "#000")
          .attr(
            "d",
            d3
              .area()
              .x0((b) => -binXScale(b.length))
              .x1((b) => binXScale(b.length))
              .y((b) => globalYScale(Math.max(b.x0, binMin))) // Use global y-scale for consistent positioning
              .y0((b) => globalYScale(Math.min(b.x1, binMax))) // Use global y-scale for consistent positioning
              .curve(d3.curveBasis)
          );
      });

    // Add axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    chart.append("g").call(d3.axisLeft(globalYScale));

    // Add title and labels
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
      .attr("y", height)
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
  }, [processedData, width, height, title, xLabel, yLabel, startDate, endDate]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-4 ml-4 pb-4 rounded-xl bg-white w-fit  relative">
      <svg className="" ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default ViolinChart;
