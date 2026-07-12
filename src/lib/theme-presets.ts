// Theme presets: coordinated color palettes + font pairings.
// Each preset sets CSS variables on :root to override the defaults from globals.css.

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  // Light mode colors
  light: {
    background: string;
    foreground: string;
    card: string;
    muted: string;
    mutedForeground: string;
    primary: string;
    primaryForeground: string;
    border: string;
    accent: string;
  };
  // Dark mode colors
  dark: {
    background: string;
    foreground: string;
    card: string;
    muted: string;
    mutedForeground: string;
    primary: string;
    primaryForeground: string;
    border: string;
    accent: string;
  };
  // Font family (applies to both modes)
  fontSans: string;
  fontHeading: string;
  // Swatch colors for the preview card in settings
  swatches: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Neutral slate with system fonts",
    light: {
      background: "#ffffff",
      foreground: "#0a0a0a",
      card: "#ffffff",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      primary: "#0f172a",
      primaryForeground: "#f8fafc",
      border: "#e2e8f0",
      accent: "#f1f5f9",
    },
    dark: {
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#1a1a1a",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      primary: "#fafafa",
      primaryForeground: "#0a0a0a",
      border: "#2a2a2a",
      accent: "#262626",
    },
    fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontHeading: "Inter, ui-sans-serif, system-ui, sans-serif",
    swatches: ["#0f172a", "#ffffff", "#64748b"],
  },
  {
    id: "emerald-calm",
    name: "Emerald Calm",
    description: "Soft green with rounded Poppins — grounding, therapy-friendly",
    light: {
      background: "#f7faf8",
      foreground: "#1a2e25",
      card: "#ffffff",
      muted: "#ecf3ee",
      mutedForeground: "#5a7a6a",
      primary: "#0f766e",
      primaryForeground: "#f0fdf4",
      border: "#d4e4da",
      accent: "#ecf3ee",
    },
    dark: {
      background: "#0f1714",
      foreground: "#e8f0eb",
      card: "#1a2520",
      muted: "#243029",
      mutedForeground: "#8fa89a",
      primary: "#34d399",
      primaryForeground: "#0f1714",
      border: "#2a3830",
      accent: "#243029",
    },
    fontSans: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    fontHeading: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    swatches: ["#0f766e", "#34d399", "#f7faf8"],
  },
  {
    id: "warm-sand",
    name: "Warm Sand",
    description: "Warm beige with Lora serif — cozy, journaling feel",
    light: {
      background: "#faf6f0",
      foreground: "#3d2f1f",
      card: "#fffcf5",
      muted: "#f0e8d8",
      mutedForeground: "#8a7a5f",
      primary: "#92651a",
      primaryForeground: "#fffaf0",
      border: "#e0d4bc",
      accent: "#f0e8d8",
    },
    dark: {
      background: "#1a1610",
      foreground: "#f0e8d8",
      card: "#252018",
      muted: "#2f2820",
      mutedForeground: "#a89a7f",
      primary: "#d4a85a",
      primaryForeground: "#1a1610",
      border: "#3a3128",
      accent: "#2f2820",
    },
    fontSans: "'Lora', Georgia, ui-serif, serif",
    fontHeading: "'Lora', Georgia, ui-serif, serif",
    swatches: ["#92651a", "#d4a85a", "#faf6f0"],
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Deep blue with Inter — clean, clinical, focused",
    light: {
      background: "#f0f6fa",
      foreground: "#0c1e2e",
      card: "#ffffff",
      muted: "#e0ecf2",
      mutedForeground: "#4a6a82",
      primary: "#1e40af",
      primaryForeground: "#eff6ff",
      border: "#c4d8e4",
      accent: "#e0ecf2",
    },
    dark: {
      background: "#0a1420",
      foreground: "#e0ecf2",
      card: "#14202e",
      muted: "#1e2c3c",
      mutedForeground: "#7a9aaa",
      primary: "#60a5fa",
      primaryForeground: "#0a1420",
      border: "#243345",
      accent: "#1e2c3c",
    },
    fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontHeading: "Inter, ui-sans-serif, system-ui, sans-serif",
    swatches: ["#1e40af", "#60a5fa", "#f0f6fa"],
  },
  {
    id: "rose-soft",
    name: "Rose Soft",
    description: "Gentle rose with Nunito — warm, approachable, soft",
    light: {
      background: "#fdf5f5",
      foreground: "#3d1f2a",
      card: "#ffffff",
      muted: "#f5e8e8",
      mutedForeground: "#8a5a6a",
      primary: "#be185d",
      primaryForeground: "#fdf2f8",
      border: "#e8d0d4",
      accent: "#f5e8e8",
    },
    dark: {
      background: "#1a1015",
      foreground: "#f5e8e8",
      card: "#251820",
      muted: "#2f1f28",
      mutedForeground: "#a87f8f",
      primary: "#f472b6",
      primaryForeground: "#1a1015",
      border: "#3a2830",
      accent: "#2f1f28",
    },
    fontSans: "'Nunito', ui-sans-serif, system-ui, sans-serif",
    fontHeading: "'Nunito', ui-sans-serif, system-ui, sans-serif",
    swatches: ["#be185d", "#f472b6", "#fdf5f5"],
  },
  {
    id: "purple-sage",
    name: "Purple Sage",
    description: "Muted purple with Source Sans — calm, contemplative",
    light: {
      background: "#f6f4f8",
      foreground: "#2a1f3d",
      card: "#ffffff",
      muted: "#ece8f0",
      mutedForeground: "#6a5a82",
      primary: "#6d28d9",
      primaryForeground: "#faf5ff",
      border: "#d8d0e0",
      accent: "#ece8f0",
    },
    dark: {
      background: "#110d1a",
      foreground: "#ece8f0",
      card: "#1a1525",
      muted: "#241e30",
      mutedForeground: "#8f82a0",
      primary: "#a78bfa",
      primaryForeground: "#110d1a",
      border: "#2e2640",
      accent: "#241e30",
    },
    fontSans: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    fontHeading: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
    swatches: ["#6d28d9", "#a78bfa", "#f6f4f8"],
  },
];

const STORAGE_KEY = "dbt-skills:theme-preset";

export function getSavedPresetId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "default";
  } catch {
    return "default";
  }
}

export function savePresetId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function getPreset(id: string): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS[0];
}

/**
 * Apply a theme preset to the document by setting CSS variables on :root.
 * Call this on the client side.
 */
export function applyThemePreset(id: string): void {
  const preset = getPreset(id);
  const root = document.documentElement;

  // Check if we're in dark mode
  const isDark = root.classList.contains("dark");
  const colors = isDark ? preset.dark : preset.light;

  // Set CSS variables
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--muted-foreground", colors.mutedForeground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--accent", colors.accent);

  // Set font variables
  root.style.setProperty("--font-geist-sans", preset.fontSans);
  root.style.setProperty("--font-geist-mono", preset.fontSans);
}

/**
 * Remove all custom theme overrides (revert to defaults from globals.css).
 */
export function clearThemePreset(): void {
  const root = document.documentElement;
  const props = [
    "--background", "--foreground", "--card", "--muted", "--muted-foreground",
    "--primary", "--primary-foreground", "--border", "--accent",
    "--font-geist-sans", "--font-geist-mono",
  ];
  for (const prop of props) {
    root.style.removeProperty(prop);
  }
}

/**
 * Re-apply the current preset (used when toggling dark mode).
 */
export function reapplyPreset(): void {
  const id = getSavedPresetId();
  if (id !== "default") {
    applyThemePreset(id);
  } else {
    clearThemePreset();
  }
}
