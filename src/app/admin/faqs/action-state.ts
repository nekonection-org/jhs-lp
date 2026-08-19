import type { FaqFieldErrors } from "@/lib/faqs/validation";

export interface FaqActionState {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: FaqFieldErrors;
}

export const initialFaqActionState: FaqActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
