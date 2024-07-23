// js/displaySectorInfo.js
export function displaySectorInfo(sector) {
  console.log("Displaying sector information:", sector);

  try {
    const sectorImage = document.getElementById("sectorImage");
    const sectorName = document.getElementById("sectorName");
    const sectorDescription = document.getElementById("sectorDescription");
    const sectorGoals = document.getElementById("sectorGoals");

    // Convert sector name to lowercase
    const sectorNameLowerCase = sector["Sector-Name"];

    // Construct image URLs
    const colourImageUrl = `Images/Lambeth-CAP-Climate Goals Icons/PNGS/${sectorNameLowerCase}-colour.png`;
    const whiteImageUrl = `Images/Lambeth-CAP-Climate Goals Icons/PNGS/${sectorNameLowerCase}-white.png`;
    // Set sector image with the colour variant as default
    sectorImage.src = colourImageUrl;
    console.log(`Sector Image URL set to: ${colourImageUrl}`);

    // Setting sector name
    sectorName.textContent = sector["Sector-Name"];
    console.log(`Sector Name set to: ${sector["Sector-Name"]}`);

    // Setting sector description
    sectorDescription.textContent = sector["Sector-Description"];
    console.log(`Sector Description set to: ${sector["Sector-Description"]}`);

    // Extract color code
    const sectorColour = sector["Sector-Colour"] || "#000"; // Fallback to black if not provided

    // Set the CSS variable for the color
    document.documentElement.style.setProperty("--sectorColour", sectorColour);

    // Check if any goals are not empty
    const goals = [
      sector["Goal-1-Name"],
      sector["Goal-1-Description"],
      sector["Goal-2-Name"],
      sector["Goal-2-Description"],
      sector["Goal-3-Name"],
      sector["Goal-3-Description"],
      sector["Goal-4-Name"],
      sector["Goal-4-Description"],
    ];

    const hasGoals = goals.some((goal) => goal && goal.trim() !== "");

    if (hasGoals) {
      // Displaying goals
      sectorGoals.innerHTML = `
        <button class="flex space-between align-center" id="goalsButton" onclick="toggleVisibility('goals')">
          <h2>Goals</h2><i class="fa fa-plus"></i>
        </button>
        <div id="goals" class="toggle-content hidden">
          ${
            sector["Goal-1-Name"]
              ? `<div class="goal"><h4>${sector["Goal-1-Name"]}</h4><li>${sector["Goal-1-Description"]}</li></div>`
              : ""
          }
          ${
            sector["Goal-2-Name"]
              ? `<div class="goal"><h4>${sector["Goal-2-Name"]}</h4><li>${sector["Goal-2-Description"]}</li></div>`
              : ""
          }
          ${
            sector["Goal-3-Name"]
              ? `<div class="goal"><h4>${sector["Goal-3-Name"]}</h4><li>${sector["Goal-3-Description"]}</li></div>`
              : ""
          }
          ${
            sector["Goal-4-Name"]
              ? `<div class="goal"><h4>${sector["Goal-4-Name"]}</h4><li>${sector["Goal-4-Description"]}</li></div>`
              : ""
          }
        </div>
      `;
      console.log("Sector Goals updated");
    } else {
      sectorGoals.innerHTML = ""; // Clear the goals element if there are no goals
      console.log("No goals to display");
    }
  } catch (error) {
    console.error("Error displaying sector information:", error);
  }
}
