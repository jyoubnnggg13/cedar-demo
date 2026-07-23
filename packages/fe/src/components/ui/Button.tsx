import React from "react";
import { Button as AstryxButton } from "@astryxdesign/core";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <AstryxButton
      {...props}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </AstryxButton>
  );
}
