import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

const LineChart = ({
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
  const svgRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const margin = { top: 70, right: 30, left: 100, bottom: 50 };

  const validData = useMemo(() => {
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
      .map((item) => ({
        date: new Date(item.date),
        value: parseFloat(item.value),
      }))
      .sort((a, b) => a.date - b.date);
  }, [data, startDate, endDate]);

  const dataWithGaps = useMemo(() => {
    return validData.map((item, index, array) => {
      if (index === 0) return { ...item, gap: false };
      const prevDate = array[index - 1].date;
      const currentDate = item.date;
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      return { 
        ...item, 
        gap: dayDiff > 1,
        prevPoint: array[index - 1] // Store previous point for gap visualization
      };
    });
  }, [validData]);

  useEffect(() => {
    if (!svgRef.current || dataWithGaps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain(d3.extent(dataWithGaps, (d) => d.date))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataWithGaps, (d) => d.value)])
      .nice()
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .defined((d) => !d.gap)
      .curve(d3.curveMonotoneX);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add basic axes and title elements
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickFormat((date) => {
            const allTicks = x.ticks(10);
            const isMonthlyTicks = allTicks.some(
              (d, i) =>
                i > 0 && d.getFullYear() === allTicks[i - 1].getFullYear()
            );
            return d3.timeFormat(isMonthlyTicks ? "%b %Y" : "%Y")(date);
          })
      )
      .attr("text-anchor", "middle")
      .style("font-size", "14px");

    g.append("g").call(d3.axisLeft(y)).style("font-size", "14px");

    // Add the main line
    g.append("path")
      .datum(dataWithGaps)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Add gap indicators
    const gapPoints = g.selectAll(".gap-indicator")
      .data(dataWithGaps.filter(d => d.gap))
      .enter()
      .append("g")
      .attr("class", "gap-indicator");

    // Add black dots for gap points
    gapPoints.append("circle")
      .attr("cx", d => x(d.prevPoint.date))
      .attr("cy", d => y(d.prevPoint.value))
      .attr("r", 4)
      .attr("fill", "black");

    gapPoints.append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", "black");

    // Add dashed lines between gap points
    gapPoints.append("line")
      .attr("x1", d => x(d.prevPoint.date))
      .attr("y1", d => y(d.prevPoint.value))
      .attr("x2", d => x(d.date))
      .attr("y2", d => y(d.value))
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");

    // Add regular data points
    /*g.selectAll(".dot")
      .data(dataWithGaps)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .attr("fill", "steelblue");*/

    // Add tooltip functionalitydisabled:font-black

    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${innerWidth - 200}, 0)`); // Moved 200px from right edge

    // Data point legend item
    const dataLegend = legend.append("g")
      .attr("transform", "translate(0, 0)");
    
    dataLegend.append("path")
      .attr("d", d3.line()([[0, 0], [20, 0]]))
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5);
    
    dataLegend.append("circle")
      .attr("cx", 10)
      .attr("cy", 0)
      .attr("r", 3)
      .attr("fill", "steelblue");
    
    dataLegend.append("text")
      .attr("x", 30)
      .attr("y", 4)
      .text("Data")
      .style("font-size", "18px");

    // Gap legend item
    const gapLegend = legend.append("g")
      .attr("transform", "translate(0, 25)");
    
    gapLegend.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");
    
    gapLegend.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", "black");
    
    gapLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", "black");
    
    gapLegend.append("text")
      .attr("x", 30)
      .attr("y", 4)
      .text("Gap")
      .style("font-size", "18px");

    const tooltip = g
      .append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("circle").attr("r", 4).style("fill", "#9a3412");
    tooltip.append("text").attr("x", 9).attr("dy", ".35em");

    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", () => tooltip.style("display", null))
      .on("mouseout", () => {
        tooltip.style("display", "none");
        setHoveredPoint(null);
      })
      .on("mousemove", (event) => {
        const [xPos] = d3.pointer(event);
        const bisect = d3.bisector((d) => d.date).left;
        const x0 = x.invert(xPos);
        const i = bisect(dataWithGaps, x0, 1);
        const d0 = dataWithGaps[i - 1];
        const d1 = dataWithGaps[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        tooltip.attr("transform", `translate(${x(d.date)},${y(d.value)})`);
        setHoveredPoint(d);
      });

    // Add chart labels
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
    dataWithGaps,
    width,
    height,
    xLabel,
    yLabel,
    title,
    margin.top,
    margin.bottom,
    margin.left,
    margin.right,
  ]);

  return (
    <div className="mt-4 ml-4 pb-4 rounded-xl bg-white w-fit  relative">
      <svg className="" ref={svgRef} width={width} height={height} />
      {hoveredPoint && (
        <div className="absolute top-0 flex gap-4 left-10 p-2 rounded shadow-md z-10">
          <p>Date: {hoveredPoint.date.toLocaleDateString()}</p>
          <p>Value: {hoveredPoint.value.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default LineChart;