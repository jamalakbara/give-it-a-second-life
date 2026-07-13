"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CATEGORY_LABELS, CONDITION_LABELS, type Item } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/Button";
import { ItemForm } from "@/components/ItemForm";
import { SmoothImage } from "@/components/SmoothImage";

export function AdminItemList({ refreshToken = 0 }: { refreshToken?: number }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Reload used by event handlers after edit/delete.
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/items?includeSold=true", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load items");
      setItems((await res.json()) as Item[]);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + reload whenever refreshToken changes (e.g. after a create).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/items?includeSold=true", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load items");
        return res.json();
      })
      .then((data: Item[]) => {
        if (!cancelled) {
          setItems(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load items");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Reorder optimistically, then persist the new catalog order. On failure,
  // reload from the server to snap back to the truth.
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from === -1 || to === -1) return;

    const next = arrayMove(items, from, to);
    setItems(next);
    setError("");

    try {
      const res = await fetch("/api/items/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds: next.map((item) => item.id) }),
      });
      if (!res.ok) throw new Error("Failed to save order");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save order");
      await load();
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to delete item");
      }
      setConfirmId(null);
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-serif text-h3 font-medium text-fg">Existing Items</h2>
        <span className="tracked text-[10px] text-fg-faint">
          {items.length} total
        </span>
      </div>
      {items.length > 1 && (
        <p className="tracked mb-4 text-[9px] text-fg-faint">
          Drag the handle to set catalog order
        </p>
      )}

      {error && (
        <p className="mb-4 text-[13px] text-accent">{error}</p>
      )}
      {isLoading && (
        <p className="text-[13px] text-fg-faint">Loading…</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => {
              const cover = item.images[0];
              const isEditing = editingId === item.id;
              const isConfirming = confirmId === item.id;

              return (
                <SortableRow
                  key={item.id}
                  id={item.id}
                  dragDisabled={isEditing}
                >
                  <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-glass">
                  {cover && (
                    <SmoothImage
                      src={cover.url}
                      alt={cover.alt}
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="tracked text-[10px] text-fg-faint">
                    {CATEGORY_LABELS[item.category]} ·{" "}
                    {CONDITION_LABELS[item.condition]}
                  </p>
                  <h3 className="truncate font-serif text-[18px] font-medium text-fg">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[13px] text-fg">
                      {formatPrice(item.price)}
                    </span>
                    <span
                      className={`tracked rounded-full px-2 py-0.5 text-[9px] ${
                        item.isSold
                          ? "bg-accent/15 text-accent"
                          : "glass text-fg-muted"
                      }`}
                    >
                      {item.isSold ? "Sold" : "Available"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isConfirming ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="!px-4 !py-2 !text-[10px]"
                      >
                        {deletingId === item.id ? "Deleting..." : "Confirm"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="tracked cursor-pointer text-[10px] text-fg-faint hover:text-fg"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(isEditing ? null : item.id)
                        }
                        className="tracked cursor-pointer text-[10px] text-fg-muted transition-colors hover:text-fg"
                      >
                        {isEditing ? "Close" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(item.id)}
                        className="tracked cursor-pointer text-[10px] text-accent/80 transition-colors hover:text-accent"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

                  {isEditing && (
                    <div className="mt-5 border-t border-hairline pt-5">
                      <ItemForm
                        item={item}
                        onDone={() => {
                          setEditingId(null);
                          load();
                        }}
                      />
                    </div>
                  )}
                </SortableRow>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// One draggable admin row. The grip is the only drag handle so the edit/delete
// buttons stay clickable; dragging is disabled while the row's edit form is open.
function SortableRow({
  id,
  dragDisabled,
  children,
}: {
  id: number;
  dragDisabled: boolean;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass rounded-2xl p-4 ${
        isDragging ? "z-10 opacity-90 shadow-2xl ring-1 ring-hairline" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={dragDisabled}
          aria-label="Drag to reorder"
          className="mt-1 shrink-0 cursor-grab touch-none px-1 text-[16px] leading-none text-fg-faint transition-colors hover:text-fg active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
        >
          ⠿
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
