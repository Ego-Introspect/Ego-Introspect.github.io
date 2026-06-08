/* Hero card tag icons.
 *
 * Each entry is the inner SVG content for a 16×16 viewBox. The renderer wraps
 * it with:
 *   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
 *        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
 *     …entry…
 *   </svg>
 *
 * Lookup order in main.js:
 *   1. card.icon  (explicit key on the card)
 *   2. card.scene.toLowerCase()  (default — so scene "Cooking" → key "cooking")
 *   3. "default"  (fallback dot)
 *
 * To use a different icon on a specific card, set its `icon` field in
 *   assets/data/hero-cards.js, e.g.  icon: "music"
 * To add a brand-new icon, add an entry below and reference its key the same way.
 */
window.HERO_ICONS = {
  cooking:
    '<path d="M3 7h10v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' +
    '<path d="M5 4q-.5 1 0 2M8 4q-.5 1 0 2M11 4q-.5 1 0 2"/>',
  driving:
    '<rect x="2" y="6" width="12" height="5" rx="1"/>' +
    '<circle cx="5" cy="12" r="1.1"/><circle cx="11" cy="12" r="1.1"/>' +
    '<path d="M3.5 6l1.3-2.5h6.4L12.5 6"/>',
  watering:
    '<path d="M8 2c-2 3-3.5 5.5-3.5 8a3.5 3.5 0 0 0 7 0c0-2.5-1.5-5-3.5-8z"/>',
  reading:
    '<path d="M8 4v10"/>' +
    '<path d="M2 4h4a2 2 0 0 1 2 2v8a2 2 0 0 0-2-2H2z"/>' +
    '<path d="M14 4h-4a2 2 0 0 0-2 2v8a2 2 0 0 1 2-2h4z"/>',
  working:
    '<rect x="2.5" y="4" width="11" height="7" rx="1"/>' +
    '<path d="M1 13h14"/>',
  walking:
    '<circle cx="9" cy="3" r="1.2"/>' +
    '<path d="M9 4.5l-1.5 3.5L9 9.5v4M5.5 14l2-4M11 7L9 8"/>',
  wearing:
    '<path d="M3.5 4l3-1 1.5 1.5L9.5 3l3 1-1 3.5h-2V13H6V7.5H4.5z"/>',
  learning:
    '<path d="M5 10a4 4 0 1 1 6 0v1.5H5z"/>' +
    '<path d="M6.5 13h3M7.5 14.5h1"/>',
  building:
    '<path d="M2.5 13.5l5.5-5.5"/>' +
    '<path d="M9 4l3 3-2 2-3-3z"/><path d="M11 6l1.5-1.5"/>',
  traveling:
    '<path d="M8 2l1.5 5L14.5 8 9.5 9 8 14l-1.5-5L1.5 8 6.5 7z"/>',
  sharing:
    '<circle cx="4" cy="4" r="1.5"/><circle cx="4" cy="12" r="1.5"/>' +
    '<circle cx="12" cy="8" r="1.5"/>' +
    '<path d="M5.4 4.7l5.2 2.6M5.4 11.3l5.2-2.6"/>',
  tasting:
    '<path d="M4 2v5q0 1.5 1.5 1.5V14"/>' +
    '<path d="M3 2v3M5 2v3M7 2v3"/>' +
    '<path d="M11 2c-1 1-1 4-1 5v1h2v6M11 8h2"/>',
  watching:
    '<path d="M1.5 8s2.5-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1.5 8 1.5 8z"/>' +
    '<circle cx="8" cy="8" r="2"/>',
  greeting:
    '<path d="M3 6c1.5 1.5 3 2 5 2s3.5-.5 5-2"/>' +
    '<path d="M3 9c1.5 1.5 3 2 5 2s3.5-.5 5-2"/>' +
    '<path d="M3 12c1.5 1.5 3 2 5 2s3.5-.5 5-2"/>',
  picking:
    '<circle cx="6" cy="11" r="2.5"/><circle cx="11" cy="11" r="2.5"/>' +
    '<path d="M6 8.5l1-3M11 8.5l1-3M7 5.5h5"/>',
  folding:
    '<rect x="3" y="3" width="10" height="10" rx="1"/>' +
    '<path d="M3 8h10"/>',
  boarding:
    '<rect x="2" y="5" width="12" height="6" rx="1"/>' +
    '<path d="M5.5 5v6M9.5 5v6"/>',
  sketching:
    '<path d="M2 14L11 5l3 3-9 9z"/>' +
    '<path d="M11 5l2-2 1.5 1.5-2 2"/>',
  music:
    '<path d="M6 13V3l7 1v3l-7-1"/>' +
    '<ellipse cx="4.5" cy="12.5" rx="1.7" ry="1.3"/>' +
    '<ellipse cx="11.5" cy="7" rx="1.7" ry="1.3"/>',
  snacking:
    '<circle cx="8" cy="9.5" r="4.5"/>' +
    '<path d="M8 5q1-2 3-2.5"/>',
  petting:
    '<circle cx="4.5" cy="6" r="1.4"/><circle cx="8" cy="4" r="1.4"/>' +
    '<circle cx="11.5" cy="6" r="1.4"/>' +
    '<ellipse cx="8" cy="11" rx="3" ry="2.5"/>',
  talking:
    '<path d="M2 4h12v7H7l-3 3v-3H2z"/>',

  // Generic fallback dot — used when no key matches.
  default: '<circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none"/>',
};
