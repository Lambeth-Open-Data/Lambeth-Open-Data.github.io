// js/header.js
export function renderHeader() {
  const headerContainer = document.querySelector("header");
  headerContainer.innerHTML = `
    <div class="flex items-center justify-between w-full px-6 py-4 bg-white shadow-lg">
      <a href="https://uat.lambethclimatepartnership.org/" class="flex items-center gap-3">
        <img 
          src="Images/lambeth-climate-partnership.png" 
          alt="Lambeth Climate Logo" 
          class="h-10 w-auto object-contain"
        />
        <span class="text-xl font-semibold text-gray-800 hidden sm:inline">Lambeth Climate Partnership</span>
      </a>
      
      <div class="relative max-w-md w-full ml-auto">
        <input 
          type="text" 
          placeholder="Search..." 
          class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <i class="fa fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>
  `;
}
