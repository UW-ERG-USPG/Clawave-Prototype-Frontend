import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BoxPlot = ({
  data,
  width,
  height,
  title,
  xLabel,
  yLabel,
  startDate,
  endDate,
  temporal,
}) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const margin = { top: 70, right: 30, bottom: 40, left: 80 };
  const parseDate = d3.timeParse("%Y-%m-%d");

  useEffect(() => {
    if (!data || !data.length) return;

    // Clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Process and group data by year
    const formattedData = data
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
      .map((d) => {
        const date = parseDate(d.date);
        return {
          timeKey: temporal === "Monthly" 
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            : date.getFullYear(),
          value: d.value,
        };
      });

    // Group by year and calculate statistics
    const groupedData = Array.from(
      d3.group(formattedData, (d) => d.year),
      ([year, values]) => {
        const sorted = values.map((d) => d.value).sort(d3.ascending);
        const q1 = d3.quantile(sorted, 0.25);
        const median = d3.quantile(sorted, 0.5);
        const q3 = d3.quantile(sorted, 0.75);
        const iqr = q3 - q1;
        const whiskerLow = d3.min(sorted.filter((d) => d >= q1 - 1.5 * iqr));
        const whiskerHigh = d3.max(sorted.filter((d) => d <= q3 + 1.5 * iqr));
        const outliers = sorted.filter(
          (d) => d < whiskerLow || d > whiskerHigh
        );

        return {
          year,
          q1,
          median,
          q3,
          whiskerLow,
          whiskerHigh,
          outliers,
        };
      }
    ).sort((a, b) => d3.ascending(a.year, b.year)); // Sort by year

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(groupedData.map((d) => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(groupedData, (d) => Math.min(d.whiskerLow, ...d.outliers)),
        d3.max(groupedData, (d) => Math.max(d.whiskerHigh, ...d.outliers)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => d.toString()))
      .selectAll("text")
      .style("font-size", "14px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "14px");

    // Draw box plots
    const boxWidth = xScale.bandwidth();

    const boxes = svg
      .selectAll("g.box")
      .data(groupedData)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", (d) => `translate(${xScale(d.year)},0)`);

    // Draw boxes
    boxes
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.q3))
      .attr("width", boxWidth)
      .attr("height", (d) => yScale(d.q1) - yScale(d.q3))
      .attr("fill", "lightblue")
      .attr("stroke", "black");

    // Draw median lines
    boxes
      .append("line")
      .attr("x1", 0)
      .attr("x2", boxWidth)
      .attr("y1", (d) => yScale(d.median))
      .attr("y2", (d) => yScale(d.median))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Draw whiskers
    boxes
      .append("line")
      .attr("x1", boxWidth / 2)
      .attr("x2", boxWidth / 2)
      .attr("y1", (d) => yScale(d.whiskerLow))
      .attr("y2", (d) => yScale(d.q1))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    boxes
      .append("line")
      .attr("x1", boxWidth / 2)
      .attr("x2", boxWidth / 2)
      .attr("y1", (d) => yScale(d.whiskerHigh))
      .attr("y2", (d) => yScale(d.q3))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw whisker caps
    boxes
      .append("line")
      .attr("x1", boxWidth * 0.25)
      .attr("x2", boxWidth * 0.75)
      .attr("y1", (d) => yScale(d.whiskerLow))
      .attr("y2", (d) => yScale(d.whiskerLow))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    boxes
      .append("line")
      .attr("x1", boxWidth * 0.25)
      .attr("x2", boxWidth * 0.75)
      .attr("y1", (d) => yScale(d.whiskerHigh))
      .attr("y2", (d) => yScale(d.whiskerHigh))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Draw outliers
    boxes
      .selectAll("circle.outlier")
      .data((d) => d.outliers.map((value) => ({ year: d.year, value })))
      .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr("cx", boxWidth / 2)
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 3)
      .attr("fill", "#9a3412")
      .attr("stroke", "#9a3412")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        setHoveredPoint(d);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
        d3.select(tooltipRef.current)
          .style("display", "block")
          .style("left", `${event.clientX}`)
          .style("top", `${event.clientY}`);
      })
      .on("mouseout", () => {
        setHoveredPoint(null);
        d3.select(tooltipRef.current).style("display", "none");
      });

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
  }, [
    data,
    width,
    height,
    title,
    xLabel,
    yLabel,
    startDate,
    endDate,
    parseDate,
    margin.top,
    margin.bottom,
    margin.left,
    margin.right,
  ]);

  return (
    <div className="mt-4 ml-4 pb-4 rounded-xl bg-white w-fit  relative">
      <svg ref={svgRef} width={width} height={height}></svg>
      <div
        ref={tooltipRef}
        className="bg-white shadow-lg  rounded-md pointer-events-none z-10"
        style={{
          position: "fixed",
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          display:
            tooltipPosition.x === 0 && tooltipPosition.y === 0
              ? "none"
              : "block",
          padding:
            tooltipPosition.x === 0 && tooltipPosition.y === 0
              ? "0"
              : "0.75rem",
        }}
      >
        {hoveredPoint && (
          <div>
            <div className="text-xl font-bold">Year: {hoveredPoint.year}</div>
            <div className="text-lg">
              Value: {hoveredPoint.value.toFixed(2)}
            </div>
            <div className="text-sm text-red-500">Outlier</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxPlot;
