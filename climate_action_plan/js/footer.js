// js/footer.js
export function renderFooter() {
  const footer = document.querySelector("footer");

  if (!footer) return;

  footer.innerHTML = `
    <div class="w-full text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-2">
      <p>&copy; ${new Date().getFullYear()} Lambeth Council. All rights reserved.</p>
      <p>
        Designed by 
        <a 
          href="https://www.land-smyrna.com" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-yellow-600 hover:text-yellow-800 underline transition"
        >
          Smyrna Aesthetics
        </a>
      </p>
    </div>
  `;
}
