import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "default" | "compact";

interface SharedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function buttonStyles({
  variant = "primary",
  size = "default",
  className,
}: Omit<SharedButtonProps, "children"> = {}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.6rem] border font-semibold tracking-[-0.01em] transition-[color,background-color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-safe:hover:-translate-y-0.5 motion-reduce:transform-none",
    size === "default" ? "px-5 py-2.5 text-sm" : "min-h-10 px-3.5 py-2 text-sm",
    variant === "primary" &&
      "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]",
    variant === "secondary" &&
      "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]",
    variant === "quiet" &&
      "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
    className,
  );
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
