// Monochrome icons (currentColor), so they follow the light and dark themes.
const svg = (inner: string, vb = '0 0 24 24', size = 20) => `<svg viewBox="${vb}" width="${size}" height="${size}" aria-hidden="true">${inner}</svg>`;

export const ICONS: Record<string, string> = {
  github: svg('<path fill="currentColor" fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>', '0 0 16 16'),
  linkedin: svg('<path fill="currentColor" d="M18.7 19.2h-2.9v-4.6c0-1.1 0-2.5-1.5-2.5-1.5 0-1.8 1.2-1.8 2.4v4.7H9.6V9.9h2.8v1.3h.04c.4-.7 1.35-1.5 2.78-1.5 2.98 0 3.52 1.96 3.52 4.5v5zM6.4 8.6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM7.85 19.2H4.94V9.9h2.9v9.3z"/><rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>'),
  instagram: svg('<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z"/><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.1" cy="6.9" r="1" fill="currentColor"/>'),
  download: svg('<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/>', '0 0 24 24', 16),
};
