"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { ModeratorActionState } from "@/app/admin/moderator/action-state";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminAccessError } from "@/lib/auth/cloudflare-access";
import {
  ManagedSectionConflictError,
  ManagedSectionNotFoundError,
  updateManagedSection,
} from "@/lib/managed-sections/service";
import { moderatorContentToJson } from "@/lib/moderator/stored-content";
import { validateModeratorForm } from "@/lib/moderator/validation";

function failedState(
  message: string,
  fieldErrors: ModeratorActionState["fieldErrors"] = {},
): ModeratorActionState {
  return { status: "error", message, fieldErrors };
}

function parseVersion(formData: FormData) {
  const value = formData.get("version");
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const version = Number(value);
  return Number.isSafeInteger(version) && version >= 1 ? version : null;
}

export async function updateModeratorAction(
  _previousState: ModeratorActionState,
  formData: FormData,
): Promise<ModeratorActionState> {
  try {
    const identity = await requireAdmin();
    const validation = validateModeratorForm(formData);
    const version = parseVersion(formData);

    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }
    if (version === null) {
      return failedState("更新情報が不正です。画面を開き直してください。");
    }

    await updateManagedSection(
      "moderator",
      version,
      {
        ja: moderatorContentToJson(validation.data.ja),
        en: moderatorContentToJson(validation.data.en),
      },
      identity,
    );
  } catch (error) {
    if (error instanceof AdminAccessError) throw error;
    if (error instanceof ManagedSectionConflictError) {
      return failedState(
        "ほかの管理者が先に更新しました。画面を開き直してください。",
      );
    }
    if (error instanceof ManagedSectionNotFoundError) {
      return failedState("モデレーター募集コンテンツが見つかりません。");
    }
    console.error("Moderator content mutation failed.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return failedState(
      "保存できませんでした。時間を置いてからもう一度お試しください。",
    );
  }

  updateTag("moderator-content");
  revalidatePath("/");
  revalidatePath("/admin/moderator");
  redirect("/admin/moderator?saved=1");
}
