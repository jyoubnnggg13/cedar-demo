import { defineTheme } from "@astryxdesign/core";

/**
 * Cedar Example 커스텀 테마
 * 
 * Astryx Design System을 기반으로 Cedar Example 프로젝트에 맞는
 * 커스텀 테마를 정의합니다.
 */
const cedarTheme = defineTheme({
  name: "cedar-example",
  tokens: {
    "--color-accent": "#6366f1",
    "--color-background-surface": ["#ffffff", "#18181b"],
    "--color-background-body": ["#f4f4f5", "#27272a"],
    "--color-background-muted": ["#e4e4e7", "#3f3f46"],
    "--color-text-primary": ["#18181b", "#fafafa"],
    "--color-text-secondary": ["#71717a", "#a1a1aa"],
    "--color-border": ["#e4e4e7", "#3f3f46"],
    "--color-border-emphasized": ["#d4d4d8", "#52525b"],
    "--radius-inner": "4px",
    "--radius-element": "8px",
    "--radius-container": "12px",
    "--radius-page": "16px",
    "--duration-fast": "150ms",
    "--duration-medium": "300ms",
  },
});

export default cedarTheme;
