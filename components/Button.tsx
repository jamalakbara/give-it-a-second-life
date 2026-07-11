import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[12px] tracking-[0.14em] uppercase font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none min-h-[44px]";

const variants: Record<Variant, string> = {
  primary: "bg-cream text-void hover:bg-white active:scale-[0.98]",
  secondary: "glass text-fg hover:bg-glass-strong",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
