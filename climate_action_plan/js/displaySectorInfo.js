// js/displaySectorInfo.js
export function displaySectorInfo(sector) {
  console.log("Displaying sector information:", sector);

  try {
    const sectorImage = document.getElementById("sectorImage");
    const sectorNameEl = document.getElementById("sectorName");
    const sectorDescriptionEl = document.getElementById("sectorDescription");
    const sectorGoalsEl = document.getElementById("sectorGoals");

    const sectorName = sector?.["Sector-Name"] ?? "Unknown Sector";

    // Image URLs based on sector name
    const colourImageUrl = `Images/Lambeth-CAP-Climate Goals Icons/PNGS/${sectorName}-colour.png`;
    const whiteImageUrl = `Images/Lambeth-CAP-Climate Goals Icons/PNGS/${sectorName}-white.png`;

    // Set sector image
    sectorImage.src = colourImageUrl;
    sectorImage.alt = `${sectorName} Logo`;
    console.log(`Sector Image URL set to: ${colourImageUrl}`);

    // Set sector name and description
    sectorNameEl.textContent = sectorName;
    sectorDescriptionEl.textContent =
      sector?.["Sector-Description"] ?? "No description available.";
    console.log(`Sector Name set to: ${sectorName}`);
    console.log(`Sector Description set.`);

    // Set CSS variable for sector color (fallback black)
    const sectorColour = sector?.["Sector-Colour"] ?? "#000000";
    document.documentElement.style.setProperty("--sectorColour", sectorColour);

    // Gather goals dynamically (assuming max 4 goals, each with Name + Description)
    const goals = [];
    for (let i = 1; i <= 4; i++) {
      const name = sector?.[`Goal-${i}-Name`]?.trim();
      const desc = sector?.[`Goal-${i}-Description`]?.trim();
      if (name || desc) {
        goals.push({ name, desc });
      }
    }

    // Clear previous content
    sectorGoalsEl.innerHTML = "";

    if (goals.length > 0) {
      // Create the goals toggle button
      const goalsButton = document.createElement("button");
      goalsButton.id = "goalsButton";
      goalsButton.type = "button";
      goalsButton.className =
        "flex justify-between items-center w-full rounded-lg bg-gray-200 hover:bg-gray-300 px-4 py-2 cursor-pointer text-lg font-semibold text-gray-900 transition";
      goalsButton.innerHTML = `<span>Goals</span><i class="fa fa-plus text-xl text-[var(--sectorColour)]"></i>`;

      // Create container for goals list, initially hidden
      const goalsContainer = document.createElement("div");
      goalsContainer.id = "goals";
      goalsContainer.className = "toggle-content mt-3";

      // Populate goals list
      goals.forEach(({ name, desc }) => {
        if (!name && !desc) return;
        const goalDiv = document.createElement("div");
        goalDiv.className = "goal border-b border-gray-300 pb-3 mb-3 last:mb-0";

        if (name) {
          const h4 = document.createElement("h4");
          h4.className =
            "text-lg font-semibold text-[var(--sectorColour)] mb-1";
          h4.textContent = name;
          goalDiv.appendChild(h4);
        }

        if (desc) {
          const li = document.createElement("li");
          li.className = "list-disc list-inside text-gray-700 text-sm";
          li.textContent = desc;
          goalDiv.appendChild(li);
        }

        goalsContainer.appendChild(goalDiv);
      });

      // Append button and container to goals element
      sectorGoalsEl.appendChild(goalsButton);
      sectorGoalsEl.appendChild(goalsContainer);

      // Add toggle functionality without inline onclick attribute
      goalsButton.addEventListener("click", () => {
        goalsContainer.classList.toggle("visible");
        // Toggle plus/minus icon
        const icon = goalsButton.querySelector("i.fa");
        if (goalsContainer.classList.contains("visible")) {
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        } else {
          icon.classList.remove("fa-minus");
          icon.classList.add("fa-plus");
        }
      });

      console.log("Sector Goals updated");
    } else {
      console.log("No goals to display");
    }
  } catch (error) {
    console.error("Error displaying sector information:", error);
  }
}
