import type { RulesFieldErrors } from "@/lib/rules/validation";

export interface RulesActionState {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: RulesFieldErrors;
}

export const initialRulesActionState: RulesActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
