export function renderChart(data, elementId, chartInfo) {
  console.log("Rendering chart with info:", chartInfo);

  // Dimensions and margins
  const margin = { top: 20, right: 20, bottom: 30, left: 70 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3
    .select(`#${elementId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Detect numeric vs categorical X values
  const xValues = data.map((d) => d[chartInfo["X-Axis"]]);
  const allNumeric = xValues.every((v) => !isNaN(parseFloat(v)));

  let x, xAxis;

  if (allNumeric) {
    // Numeric X-axis
    x = d3
      .scaleLinear()
      .domain(d3.extent(xValues, (v) => +v))
      .nice()
      .range([0, width]);

    // Limit tick count to ~7
    xAxis = d3.axisBottom(x).ticks(7).tickFormat(d3.format("d"));
  } else {
    // Categorical X-axis
    x = d3
      .scalePoint()
      .domain(xValues)
      .range([0, width])
      .padding(0.5);

    // Pick around 7 evenly spaced tick labels
    const totalLabels = xValues.length;
    const step = Math.ceil(totalLabels / 7);
    const shownTicks = xValues.filter((_, i) => i % step === 0);

    xAxis = d3.axisBottom(x).tickValues(shownTicks);
  }

  // Y-axis (always numeric)
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[chartInfo["Y-Axis"]])])
    .nice()
    .range([height, 0]);

  // Append X axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.6em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-40)"); // rotate labels for readability

  // Add X-axis label
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .text(chartInfo["X-Axis"]);

  // Append Y axis
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

  // Define line generator
  const line = d3
    .line()
    .x((d) =>
      allNumeric ? x(+d[chartInfo["X-Axis"]]) : x(d[chartInfo["X-Axis"]])
    )
    .y((d) => y(+d[chartInfo["Y-Axis"]]));

  // Append line path
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "var(--sectorColour, black)")
    .attr("stroke-width", 2);

  // Add data point circles
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) =>
      allNumeric ? x(+d[chartInfo["X-Axis"]]) : x(d[chartInfo["X-Axis"]])
    )
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
