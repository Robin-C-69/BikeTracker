export const colors = {
  primary: "#22b383",
  primaryLight: "#00ff66",
  primaryDark: "#007d51",
  background: "#090b09",
  surface: "#121612",
  surfaceVariant: "#00FF660D",
  error: "#ff4444",
  errorDark: "#FF453A1A",
  warning: "#ff9800",
  warningDark: "rgba(255, 193, 7, 0.08)",
  success: "#22c55e",
  greenHint: "rgba(34, 179, 131, 0.08)",
  text: {
    primary: "#ffffff",
    secondary: "#8B998B",
    tertiary: "#888888",
    lighting: "#00ff66",
    disabled: "#666666",
    error: "#ff453a",
  },
  border: {
    default: "#233323",
    lighting: "#00ff6630",
    error: "#ff453a33",
    disabled: "#888888",
  },
};

export const spacing = (value: number) => {
  return value * 8;
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
