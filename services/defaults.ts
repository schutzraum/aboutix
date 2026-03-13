
// Icons paths (approximate simplified paths for standard icons)
const ICONS: Record<string, string> = {
  'Musik': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  'Technologie': '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  'Kunst': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="11.5" cy="6.5" r="1.5"/><circle cx="7" cy="14" r="1.5"/><circle cx="16.5" cy="11.5" r="1.5"/>',
  'Party': '<path d="M6 22l-3-3 5.5-5.5a8.3 8.3 0 0 1-2.4-3.8 8.4 8.4 0 0 1 3.8-2.4L4 2 2 4l5.5 5.5a8.4 8.4 0 0 1 3.8 2.4 8.3 8.3 0 0 1 2.4 3.8L19 22l-3-3"/><path d="M18 10l4-4"/><path d="M14 6l4-4"/><path d="M22 6l-4 4"/>',
  'Essen': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  'Sport & Streaming': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  'Diskussion & Debatten': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  'Sonstiges': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'default': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'
};

const getRandomGradient = () => {
  const colors = [
    ['#F43F5E', '#8B5CF6'],
    ['#3B82F6', '#10B981'],
    ['#F59E0B', '#EF4444'],
    ['#8B5CF6', '#EC4899'],
    ['#06B6D4', '#3B82F6'],
    ['#10B981', '#F59E0B'],
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateDefaultImages = (categories: string[]) => {
  const [color1, color2] = getRandomGradient();
  
  // Use first category for icon logic, or default
  // const primaryCategory = categories && categories.length > 0 ? categories[0] : 'default';

  // SVG for Cover (16:9, Gradient only)
  const coverSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;

  return {
    cover: `data:image/svg+xml;base64,${btoa(coverSvg)}`
  };
};