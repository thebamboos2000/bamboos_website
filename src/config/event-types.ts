import type { EventTypeId } from "@/types/domain";

/** Shared with the browser form, so this file must never import images or content. */
export const EVENT_TYPES = [
  { id: "wedding", label: "Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "reception", label: "Reception" },
  { id: "birthday", label: "Birthday Celebration" },
  { id: "corporate", label: "Corporate Event" },
  { id: "conference", label: "Conference" },
  { id: "other", label: "Other" },
] as const satisfies readonly { id: EventTypeId; label: string }[];

export const EVENT_TYPE_IDS = EVENT_TYPES.map((type) => type.id) as [EventTypeId, ...EventTypeId[]];

export function isEventTypeId(value: string | null | undefined): value is EventTypeId {
  return EVENT_TYPE_IDS.includes(value as EventTypeId);
}

export function eventTypeLabel(id: EventTypeId): string {
  return EVENT_TYPES.find((type) => type.id === id)?.label ?? id;
}
