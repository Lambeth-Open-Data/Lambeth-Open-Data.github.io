// js/menu.js
import { fetchSectors } from "./fetchData.js";

export async function renderMenu() {
  console.log("Rendering menu...");

  const menuContainer = document.querySelector(".sideMenu");

  try {
    console.log("Fetching sectors data...");
    const sectors = await fetchSectors();
    console.log("Sectors data fetched:", sectors);

    if (!sectors || sectors.length === 0) {
      console.warn("No sectors data found.");
      menuContainer.innerHTML = `
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <a href="index.html" class="block text-gray-700 hover:text-blue-600 font-medium">Home</a>
            </li>
          </ul>
        </nav>`;
      return;
    }

    // Generate menu items
    const menuList = sectors
      .map((sector) => {
        const color = sector["Sector-Colour"] || "#888";
        const name = sector["Sector-Name"];
        const id = sector["Sector-ID"];

        return `
          <li>
            <a 
              href="sector.html?id=${id}"
              class="flex items-start gap-3 pl-2 pr-4 py-2 rounded-lg text-gray-800 hover:bg-gray-100 transition"
            >
              <span class="h-3 w-3 mt-1 rounded-full flex-shrink-0" style="background-color: ${color};"></span>
              <span class="text-sm leading-snug">${name}</span>
            </a>
          </li>`;
      })
      .join("");

    menuContainer.innerHTML = `
      <nav class="p-4 bg-white h-full border-r border-gray-200">
        <ul class="space-y-2">
          <li>
            <a href="kpis.html" class="flex items-center gap-3 pl-2 pr-4 py-2 rounded-lg text-gray-800 hover:bg-gray-100 transition">
              <i class="fa fa-home text-blue-500"></i>
              <span class="text-sm font-medium">Home</span>
            </a>
          </li>
          ${menuList}
        </ul>
      </nav>`;

    console.log("Menu rendered");
  } catch (error) {
    console.error("Error rendering menu:", error);
  }
}
