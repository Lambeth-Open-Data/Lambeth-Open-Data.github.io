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

  // Detect whether X-axis values are numeric
  const xValues = data.map((d) => d[chartInfo["X-Axis"]]);
  const allNumeric = xValues.every((v) => !isNaN(parseFloat(v)));

  let x;
  let xAxis;

  if (allNumeric) {
    // Numeric X-axis (linear scale)
    x = d3
      .scaleLinear()
      .domain(d3.extent(xValues, (v) => +v))
      .nice()
      .range([0, width]);

    xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format("d"));
    console.log("Using linear X scale:", x.domain());
  } else {
    // Categorical X-axis (point scale)
    x = d3
      .scalePoint()
      .domain(xValues)
      .range([0, width])
      .padding(0.5);

    xAxis = d3.axisBottom(x);
    console.log("Using point X scale:", x.domain());
  }

  // Define Y scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[chartInfo["Y-Axis"]])])
    .nice()
    .range([height, 0]);

  console.log("Y scale domain:", y.domain());

  // Append X axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text(chartInfo["X-Axis"]);

  console.log("X axis appended");

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

  console.log("Y axis appended with label:", chartInfo["Unit"]);

  // Define line generator
  const line = d3
    .line()
    .x((d) =>
      allNumeric ? x(+d[chartInfo["X-Axis"]]) : x(d[chartInfo["X-Axis"]])
    )
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

  // Add circles for data points
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
      } \n${chartInfo["X-Axis"]}: ${d[chartInfo["X-Axis"]]}`;
    });

  console.log("Circles with hover effects and tooltips added");

  console.log("Chart rendering complete");
}
