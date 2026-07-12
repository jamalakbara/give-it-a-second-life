import type { Item } from "@/lib/types";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CardMedia } from "@/components/CardMedia";

export function ItemCard({ item }: { item: Item }) {
  const cover = item.images[0];

  return (
    <article>
      <CardMedia
        href={`/items/${item.id}`}
        cover={cover}
        title={item.title}
        itemId={item.id}
        isSold={item.isSold}
      />

      <div className="mt-4">
        <p className="tracked text-[10px] text-fg-faint">
          {CATEGORY_LABELS[item.category]}
        </p>
        <h3 className="mt-1.5 font-serif text-[22px] font-medium leading-tight text-fg">
          {item.title}
        </h3>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[15px] text-fg">{formatPrice(item.price)}</span>
          <span className="glass tracked rounded-full px-2.5 py-1 text-[9px] text-fg-muted">
            {CONDITION_LABELS[item.condition]}
          </span>
        </div>
      </div>
    </article>
  );
}
