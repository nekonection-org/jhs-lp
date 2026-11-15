import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "default" | "compact";

interface SharedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

// Adapted from shadcn/ui's button variant pattern; keep native link semantics.
const buttonVariants = cva(
  "interactive-button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]",
        secondary:
          "border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]",
        quiet:
          "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
      },
      size: {
        default: "px-5 py-2.5",
        compact: "px-3.5 py-2",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function buttonStyles({
  variant,
  size,
  className,
}: Omit<SharedButtonProps, "children"> = {}) {
  return cn(buttonVariants({ variant, size }), className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SharedButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  ),
);

Button.displayName = "Button";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  SharedButtonProps;

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonStyles({ variant, size, className })} {...props} />
  );
}
