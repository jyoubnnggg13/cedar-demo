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
}
