import { renderChart } from "./chartService.js";

export function displayCharts(sectorCharts) {
  console.log("Displaying charts:", sectorCharts);

  const chartsContainer = document.getElementById("chartsContainer");

  // Clear previous charts
  chartsContainer.innerHTML = "";

  // Generate HTML for each chart
  const chartsHTML = sectorCharts
    .map(
      (chart) => `
    <div class="chart ${chart["Target"]}">
      ${
        chart["Target"] === "y"
          ? "<div class='flex centred target-container'><h5>Target</h5><img id='target-img' src='Images/target.png' alt='target icon'></div>"
          : ""
      }
      <h3>${chart["Chart-Name"]}</h3>
      <div id="chart-${chart["Chart-ID"]}"></div>
      <div class="chart-meta">
        <p>${chart["Chart-Description"]}</p>
        <p><strong>Data Source:</strong> ${chart["Data-Source"]}</p>
        ${
          chart["Source-Website"].startsWith("https")
            ? `<p><strong>Source:</strong> <a href="${chart["Source-Website"]}" target="_blank">${chart["Source-Website"]}</a></p>`
            : `<p><strong>Source:</strong> ${chart["Source-Website"]}</p>`
        }
      </div>
    </div>
  `
    )
    .join("");

  // Insert HTML into the container
  chartsContainer.innerHTML = chartsHTML;
  console.log("Charts HTML rendered");

  // Load data for each chart and render it
  sectorCharts.forEach((chart) => {
    const csvFileName = chart["CSV-File"];
    const encodedFileName = encodeURIComponent(csvFileName);
    const csvFilePath = `Data/CSV Files/${encodedFileName}`;

    console.log(
      `Fetching data for chart ${chart["Chart-ID"]} from ${csvFilePath}`
    );

    fetch(csvFilePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${csvFilePath}`);
        }
        return response.text();
      })
      .then((csvText) => {
        console.log(`CSV data for chart ${chart["Chart-ID"]}:`, csvText);
        let chartData = Papa.parse(csvText, { header: true }).data;

        // Log the parsed data before filtering
        console.log(`Parsed chart data for ${chart["Chart-ID"]}:`, chartData);

        // Filter out rows where all fields are empty
        chartData = chartData.filter((row) =>
          Object.values(row).some((value) => value.trim() !== "")
        );

        // Log the filtered data to ensure rows aren't incorrectly removed
        console.log(`Filtered chart data for ${chart["Chart-ID"]}:`, chartData);

        renderChart(chartData, `chart-${chart["Chart-ID"]}`, chart);
      })
      .catch((error) => {
        console.error(
          `Error fetching or parsing data for chart ${chart["Chart-ID"]}:`,
          error
        );
      });
  });
}
