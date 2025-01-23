export function renderChart(data, elementId, chartInfo) {
  console.log("Rendering chart with info:", chartInfo);

  // Dimensions and margins for the chart
  const margin = { top: 20, right: 20, bottom: 30, left: 70 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  console.log("Chart dimensions:", { width, height });

  // Create SVG container
  const svg = d3
    .select(`#${elementId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define X and Y scales
  const xDomain = [...new Set(data.map((d) => +d[chartInfo["X-Axis"]]))].sort(
    (a, b) => a - b
  );
  const x = d3.scaleLinear().domain(d3.extent(xDomain)).range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[chartInfo["Y-Axis"]])])
    .nice()
    .range([height, 0]);

  console.log("X scale domain:", x.domain());
  console.log("Y scale domain:", y.domain());

  // Determine tick values to limit max ticks to 7 and min to 2
  const tickCount = Math.min(7, Math.max(2, xDomain.length));
  const tickValues = xDomain.filter(
    (d, i) => i % Math.ceil(xDomain.length / tickCount) === 0
  );

  // Append X axis with formatted ticks
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(tickValues).tickFormat(d3.format("d")))
    .selectAll("text")
    .attr("text-anchor", "middle");

  console.log("X axis appended with dynamic ticks:", tickValues);

  // Append Y axis with a maximum of 5 ticks
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(5))
    .append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr("x", -height / 2)
    .attr("dy", "0.71em")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .style("font-size", "14px")
    .style("font-family", "sans-serif")
    .text(chartInfo["Unit"]);

  console.log("Y axis appended with label:", chartInfo["Unit"]);

  // Define line generator function
  const line = d3
    .line()
    .x((d) => x(+d[chartInfo["X-Axis"]]))
    .y((d) => y(+d[chartInfo["Y-Axis"]]));

  console.log("Line generator function created");

  // Append line path
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "var(--sectorColour, black)")
    .attr("stroke-width", 2);

  console.log("Line path appended");

  // Add circles to each data point with hover effects and title elements
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(+d[chartInfo["X-Axis"]]))
    .attr("cy", (d) => y(+d[chartInfo["Y-Axis"]]))
    .attr("r", 4)
    .attr("fill", "var(--sectorColour, black)")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 6)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    })
    .on("mouseout", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 4)
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    })
    .append("title")
    .text((d) => {
      const formatNumber = d3.format(",.1f");
      return `Value: ${formatNumber(d[chartInfo["Y-Axis"]])} ${
        chartInfo["Unit"]
      } \nYear: ${d[chartInfo["X-Axis"]]}`;
    });

  console.log("Circles with hover effects and tooltips added");

  // Log final chart rendered
  console.log("Chart rendering complete");
}
