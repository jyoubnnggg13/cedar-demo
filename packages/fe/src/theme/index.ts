import { defineTheme } from "@astryxdesign/core";
import { neutralTheme } from "@astryxdesign/theme-neutral";

/**
 * Cedar Example 커스텀 테마
 * 
 * Astryx Design System을 기반으로 Cedar Example 프로젝트에 맞는
 * 커스텀 테마를 정의합니다.
 */
const cedarTheme = defineTheme(neutralTheme, {
  color: {
    accent: "#6366f1",
    neutralStyle: "cool",
    contrast: "standard",
  },
  typography: {
    scale: {
      base: 16,
      ratio: 1.25,
    },
    body: {
      family: "Inter",
      fallbacks: ["system-ui", "sans-serif"],
    },
    heading: {
      family: "Inter",
      weight: 600,
    },
    code: {
      family: "JetBrains Mono",
    },
  },
  radius: {
    base: 4,
    multiplier: 1,
  },
  motion: {
    fast: 150,
    medium: 300,
    ratio: 1.5,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: "var(--color-accent)",
          color: "white",
        },
        ghost: {
          backgroundColor: "transparent",
          border: "1px solid var(--color-border-default)",
        },
        danger: {
          backgroundColor: "#ef4444",
          color: "white",
        },
      },
    },
    Card: {
      variants: {
        elevated: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
        outlined: {
          border: "1px solid var(--color-border-default)",
        },
      },
    },
  },
});

export default cedarTheme;
