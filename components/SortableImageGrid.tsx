"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Drag-to-reorder thumbnail grid used by the admin item form. The first tile is
// the catalog cover. Order of `urls` is authoritative — the parent submits it
// straight to the API where index → display_order.
export function SortableImageGrid({
  urls,
  onReorder,
  onRemove,
}: {
  urls: string[];
  onReorder: (next: string[]) => void;
  onRemove: (index: number) => void;
}) {
  const sensors = useSensors(
    // 6px activation distance so tapping the ✕ button doesn't start a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = urls.indexOf(String(active.id));
    const to = urls.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(urls, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={urls} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url, index) => (
            <SortableThumb
              key={url}
              url={url}
              index={index}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableThumb({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-[6px] ring-1 ring-hairline transition ${
        isDragging ? "z-10 opacity-80 shadow-2xl" : ""
      }`}
    >
      {/* Whole tile is the drag handle; ✕ has its own stopPropagation. */}
      <div
        {...attributes}
        {...listeners}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={`Upload ${index + 1}`}
          className="pointer-events-none h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {index === 0 && (
        <span className="tracked pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-cream px-2 py-0.5 text-[8px] font-medium text-void">
          Cover
        </span>
      )}

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[12px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-aurora-rose/80 group-hover:opacity-100"
        aria-label={`Remove image ${index + 1}`}
      >
        ✕
      </button>
    </div>
  );
}
