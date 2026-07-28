import "@astryxdesign/core";

/**
 * Cedar Example 커스텀 배리언트 타입 선언
 */

declare module "@astryxdesign/core" {
  export interface ButtonProps {
    variant?: "primary" | "ghost" | "danger" | "default";
  }

  export interface CardProps {
    variant?: "elevated" | "outlined" | "default";
  }

  export interface ThemeTokens {
    color: ThemeColors;
    duration: ThemeDurations;
    radius: ThemeRadius;
    font: ThemeFonts;
  }

  export interface ThemeColors {
    accent: string;
    backgroundPrimary: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    borderDefault: string;
    borderStrong: string;
    borderSubtle: string;
  }

  export interface ThemeDurations {
    fast: string;
    medium: string;
  }

  export interface ThemeRadius {
    inner: string;
    element: string;
    container: string;
  }

  export interface ThemeFonts {
    body: string;
    heading: string;
    code: string;
  }

  export interface UseThemeReturn {
    tokens: ThemeTokens;
    mode: "light" | "dark" | "system";
    resolvedMode: "light" | "dark";
    setMode: (mode: "light" | "dark" | "system") => void;
    icons: Record<string, unknown>;
  }

  export function useTheme(): UseThemeReturn;
}
