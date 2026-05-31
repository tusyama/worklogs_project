export const tokens = {
  colors: {
    bg: "#f4f6f8",
    surface: "#ffffff",
    border: "#d8dee4",
    text: "#1a1f24",
    textMuted: "#5c6770",
    primary: "#1565c0",
    primaryHover: "#0d47a1",
    danger: "#c62828",
    dangerHover: "#b71c1c",
    overlay: "rgba(0, 0, 0, 0.45)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  fontSizes: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
  shadows: {
    modal: "0 12px 40px rgba(0, 0, 0, 0.18)",
    card: "0 2px 8px rgba(0, 0, 0, 0.06)",
  },
  zIndex: {
    modal: 1000,
  },
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
  },
} as const;

export type Theme = typeof tokens;
