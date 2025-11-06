export function renderChart(data, elementId, chartInfo) {
  console.log("Rendering chart with info:", chartInfo);

  const margin = { top: 20, right: 20, bottom: 40, left: 70 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3
    .select(`#${elementId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Extract X values
  const xValues = data.map((d) => d[chartInfo["X-Axis"]]);
  const allNumeric = xValues.every((v) => !isNaN(parseFloat(v)));

  let x, xAxis;

  if (allNumeric) {
    const numericValues = xValues.map((v) => +v);
    const uniqueValues = Array.from(new Set(numericValues)).sort((a, b) => a - b);

    if (uniqueValues.length <= 20) {
      // Treat discrete numeric values (e.g., years) as categorical points
      x = d3
        .scalePoint()
        .domain(uniqueValues)
        .range([0, width])
        .padding(0.5);

      // Show about 7 ticks
      const step = Math.ceil(uniqueValues.length / 7);
      const shownTicks = uniqueValues.filter((_, i) => i % step === 0);
      xAxis = d3.axisBottom(x).tickValues(shownTicks);
    } else {
      // Continuous numeric values (e.g., measurements)
      x = d3
        .scaleLinear()
        .domain(d3.extent(numericValues))
        .nice()
        .range([0, width]);
      xAxis = d3.axisBottom(x).ticks(7).tickFormat(d3.format("d"));
    }
  } else {
    // Categorical X-axis (text labels)
    const uniqueValues = Array.from(new Set(xValues));
    x = d3
      .scalePoint()
      .domain(uniqueValues)
      .range([0, width])
      .padding(0.5);

    // Show about 7 evenly spaced labels
    const step = Math.ceil(uniqueValues.length / 7);
    const shownTicks = uniqueValues.filter((_, i) => i % step === 0);
    xAxis = d3.axisBottom(x).tickValues(shownTicks);
  }

  // --- Y-Axis: handle positive & negative values ---
  const yMin = d3.min(data, (d) => +d[chartInfo["Y-Axis"]]);
  const yMax = d3.max(data, (d) => +d[chartInfo["Y-Axis"]]);
  const y = d3
    .scaleLinear()
    .domain([Math.min(0, yMin), Math.max(0, yMax)])
    .nice()
    .range([height, 0]);

  // Draw X-axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.6em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-40)");

  // X-axis label
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 55)
    .attr("text-anchor", "middle")
    .text(chartInfo["X-Axis"]);

  // Draw Y-axis
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

  // Line generator
  const line = d3
    .line()
    .x((d) => {
      const xVal = d[chartInfo["X-Axis"]];
      return allNumeric ? x(+xVal) : x(xVal);
    })
    .y((d) => y(+d[chartInfo["Y-Axis"]]));

  // Draw line
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "var(--sectorColour, black)")
    .attr("stroke-width", 2);

  // Draw circles
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => {
      const xVal = d[chartInfo["X-Axis"]];
      return allNumeric ? x(+xVal) : x(xVal);
    })
    .attr("cy", (d) => y(+d[chartInfo["Y-Axis"]]))
    .attr("r", 4)
    .attr("fill", "var(--sectorColour, black)")
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 6)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    })
    .on("mouseout", function () {
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
      }\n${chartInfo["X-Axis"]}: ${d[chartInfo["X-Axis"]]}`;
    });

  console.log("Chart rendering complete");
}
