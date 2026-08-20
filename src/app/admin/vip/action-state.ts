import type { VipFieldErrors } from "@/lib/vip/validation";

export interface VipActionState {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: VipFieldErrors;
}

export const initialVipActionState: VipActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
