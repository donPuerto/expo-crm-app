type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassValue[];

function flattenClassValues(input: ClassValue, out: string[]) {
  if (!input) return;

  if (typeof input === 'string' || typeof input === 'number') {
    out.push(String(input));
    return;
  }

  if (Array.isArray(input)) {
    for (const item of input) flattenClassValues(item, out);
    return;
  }

  if (typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      if (value) out.push(key);
    }
  }
}

// Legacy helper kept for compatibility; Tailwind/NativeWind is not used.
export function cn(...inputs: ClassValue[]) {
  const parts: string[] = [];
  for (const input of inputs) flattenClassValues(input, parts);
  return parts.join(' ');
}

/**
 * Converts a hex color to rgba format with optional opacity
 * @param hex - Hex color string (e.g., '#2563eb' or '#2563ebCC')
 * @param opacity - Optional opacity value (0-1). If not provided, extracts from hex if present
 * @returns rgba color string
 */
export function hexToRgba(hex: string, opacity?: number): string {
  // Remove # if present
  let cleanHex = hex.replace('#', '');

  // Extract alpha if present (8 characters = RRGGBBAA)
  let alpha = opacity;
  if (cleanHex.length === 8 && opacity === undefined) {
    const alphaHex = cleanHex.substring(6, 8);
    alpha = parseInt(alphaHex, 16) / 255;
    cleanHex = cleanHex.substring(0, 6);
  } else if (cleanHex.length === 6) {
    alpha = opacity ?? 1;
  }

  // Parse RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Adds opacity to a hex color
 * @param hex - Hex color string (e.g., '#2563eb')
 * @param opacity - Opacity value (0-1)
 * @returns rgba color string
 */
export function addOpacityToHex(hex: string, opacity: number): string {
  return hexToRgba(hex, opacity);
}
