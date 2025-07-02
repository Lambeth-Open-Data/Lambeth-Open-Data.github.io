import { renderChart } from "./chartService.js";

export async function displayCharts(sectorCharts) {
  console.log("Displaying charts:", sectorCharts);

  const chartsContainer = document.getElementById("chartsContainer");
  if (!chartsContainer) {
    console.error("Charts container not found");
    return;
  }

  chartsContainer.innerHTML = ""; // Clear previous charts

  if (!Array.isArray(sectorCharts) || sectorCharts.length === 0) {
    chartsContainer.innerHTML = "<p>No charts available.</p>";
    return;
  }

  // Generate and insert HTML for all charts
  chartsContainer.innerHTML = sectorCharts
    .map(
      ({
        "Chart-ID": id,
        "Chart-Name": name,
        Target,
        "Chart-Description": desc,
        "Data-Source": source,
        "Source-Website": website,
      }) => `
      <div class="chart ${Target} bg-white rounded-lg shadow-lg border border-gray-300 p-6 relative">
        ${
          Target === "y"
            ? `
          <div class="flex justify-center items-center target-container absolute top-0 right-0 bg-gray-200 p-2 rounded-bl-lg cursor-pointer">
            <h5 class="mr-2 font-semibold">Target</h5>
            <img id="target-img" src="Images/target.png" alt="target icon" class="w-6 h-6" />
          </div>`
            : ""
        }
        <h3 class="text-xl font-bold mb-4">${name}</h3>
        <div id="chart-${id}" class="chart-plot mb-4"></div>
        <div class="chart-meta mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 space-y-2 shadow-sm">
          <p class="text-gray-800 font-semibold">${desc}</p>
          <p>
            <strong class="font-medium text-gray-900">Data Source:</strong> ${source}
          </p>
          ${
            website?.startsWith("https")
              ? `<p>
                  <strong class="font-medium text-gray-900">Source:</strong>
                  <a href="${website}" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    ${website}
                  </a>
                </p>`
              : `<p><strong class="font-medium text-gray-900">Source:</strong> ${
                  website ?? "N/A"
                }</p>`
          }
        </div>

      </div>
    `
    )
    .join("");

  console.log("Charts HTML rendered");

  // Fetch and render each chart’s data asynchronously
  for (const chart of sectorCharts) {
    const csvFileName = chart["CSV-File"] ?? "";
    const encodedFileName = encodeURIComponent(csvFileName);
    const csvFilePath = `Data/CSV Files/${encodedFileName}`;
    const chartId = chart["Chart-ID"];

    console.log(`Fetching data for chart ${chartId} from ${csvFilePath}`);

    try {
      const response = await fetch(csvFilePath);
      if (!response.ok)
        throw new Error(`Network error: ${response.status} for ${csvFilePath}`);

      const csvText = await response.text();
      console.log(`CSV data for chart ${chartId}:`, csvText);

      let chartData = Papa.parse(csvText, { header: true }).data;

      // Filter out rows where all values are empty or whitespace
      chartData = chartData.filter((row) =>
        Object.values(row).some((value) => value?.trim() !== "")
      );

      console.log(`Filtered chart data for ${chartId}:`, chartData);

      renderChart(chartData, `chart-${chartId}`, chart);
    } catch (error) {
      console.error(
        `Error fetching or parsing data for chart ${chartId}:`,
        error
      );
    }
  }
}
