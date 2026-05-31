export const ENTRY_MODAL_MODE = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export type EntryModalMode = (typeof ENTRY_MODAL_MODE)[keyof typeof ENTRY_MODAL_MODE];
