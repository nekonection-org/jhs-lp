"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { VipActionState } from "@/app/admin/vip/action-state";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminAccessError } from "@/lib/auth/cloudflare-access";
import {
  ManagedSectionConflictError,
  ManagedSectionNotFoundError,
  updateManagedSection,
} from "@/lib/managed-sections/service";
import { vipContentToJson } from "@/lib/vip/stored-content";
import { validateVipForm } from "@/lib/vip/validation";

function failedState(
  message: string,
  fieldErrors: VipActionState["fieldErrors"] = {},
): VipActionState {
  return { status: "error", message, fieldErrors };
}

function parseVersion(formData: FormData) {
  const value = formData.get("version");
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }
  const version = Number(value);
  return Number.isSafeInteger(version) && version >= 1 ? version : null;
}

export async function updateVipAction(
  _previousState: VipActionState,
  formData: FormData,
): Promise<VipActionState> {
  try {
    const identity = await requireAdmin();
    const validation = validateVipForm(formData);
    const version = parseVersion(formData);

    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }
    if (version === null) {
      return failedState("更新情報が不正です。画面を開き直してください。");
    }

    await updateManagedSection(
      "vip",
      version,
      {
        ja: vipContentToJson(validation.data.ja),
        en: vipContentToJson(validation.data.en),
      },
      identity,
    );
  } catch (error) {
    if (error instanceof AdminAccessError) {
      throw error;
    }
    if (error instanceof ManagedSectionConflictError) {
      return failedState(
        "ほかの管理者が先に更新しました。画面を開き直してください。",
      );
    }
    if (error instanceof ManagedSectionNotFoundError) {
      return failedState("VIPコンテンツが見つかりません。");
    }
    console.error("VIP content mutation failed.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return failedState(
      "保存できませんでした。時間を置いてからもう一度お試しください。",
    );
  }

  updateTag("vip-content");
  revalidatePath("/");
  revalidatePath("/admin/vip");
  redirect("/admin/vip?saved=1");
}
