import type { AnnouncementFieldErrors } from "@/lib/announcements/validation";

export interface AnnouncementActionState {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: AnnouncementFieldErrors;
}

export const initialAnnouncementActionState: AnnouncementActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
