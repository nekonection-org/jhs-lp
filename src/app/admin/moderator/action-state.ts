import type { ModeratorFieldErrors } from "@/lib/moderator/validation";

export interface ModeratorActionState {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: ModeratorFieldErrors;
}

export const initialModeratorActionState: ModeratorActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
