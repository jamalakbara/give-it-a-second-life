"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { HeartIcon } from "@/components/icons";

export function WishlistButton({
  itemId,
  className = "",
  iconClassName = "size-6",
}: {
  itemId: number;
  className?: string;
  iconClassName?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(itemId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(itemId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:text-fg focus-visible:outline-none ${
        active ? "text-aurora-rose" : "text-fg-muted"
      } ${className}`}
    >
      <HeartIcon filled={active} className={iconClassName} />
    </button>
  );
}
