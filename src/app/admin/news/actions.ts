"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { AnnouncementActionState } from "@/app/admin/news/action-state";
import { AdminAccessError } from "@/lib/auth/cloudflare-access";
import { requireAdmin } from "@/lib/auth/admin";
import {
  AnnouncementConflictError,
  AnnouncementNotFoundError,
  archiveAnnouncement,
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/announcements/service";
import { validateAnnouncementForm } from "@/lib/announcements/validation";

function failedState(
  message: string,
  fieldErrors: AnnouncementActionState["fieldErrors"] = {},
): AnnouncementActionState {
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

function revalidateAnnouncementViews() {
  updateTag("announcements");
  revalidatePath("/");
  revalidatePath("/admin/news");
}

function logMutationFailure(operation: "save" | "archive", error: unknown) {
  console.error("Announcement mutation failed.", {
    operation,
    errorName: error instanceof Error ? error.name : "UnknownError",
  });
}

function handleMutationError(error: unknown) {
  if (error instanceof AdminAccessError) {
    throw error;
  }

  if (error instanceof AnnouncementConflictError) {
    return failedState(
      "ほかの管理者が先に更新しました。一覧から開き直してください。",
    );
  }

  if (error instanceof AnnouncementNotFoundError) {
    return failedState("対象のお知らせが見つかりません。");
  }

  logMutationFailure("save", error);
  return failedState(
    "保存できませんでした。時間を置いてからもう一度お試しください。",
  );
}

export async function createAnnouncementAction(
  _previousState: AnnouncementActionState,
  formData: FormData,
): Promise<AnnouncementActionState> {
  let announcementId: string;

  try {
    const identity = await requireAdmin();
    const validation = validateAnnouncementForm(formData);

    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }

    const announcement = await createAnnouncement(validation.data, identity);
    announcementId = announcement.id;
  } catch (error) {
    return handleMutationError(error);
  }

  revalidateAnnouncementViews();
  redirect(`/admin/news/${announcementId}/edit?saved=created`);
}

export async function updateAnnouncementAction(
  id: string,
  _previousState: AnnouncementActionState,
  formData: FormData,
): Promise<AnnouncementActionState> {
  try {
    const identity = await requireAdmin();
    const validation = validateAnnouncementForm(formData);
    const version = parseVersion(formData);

    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }

    if (version === null) {
      return failedState("更新情報が不正です。一覧から開き直してください。");
    }

    await updateAnnouncement(id, version, validation.data, identity);
  } catch (error) {
    return handleMutationError(error);
  }

  revalidateAnnouncementViews();
  redirect(`/admin/news/${id}/edit?saved=updated`);
}

export async function archiveAnnouncementAction(
  id: string,
  formData: FormData,
) {
  const identity = await requireAdmin();
  const version = parseVersion(formData);

  if (version === null) {
    redirect(`/admin/news/${id}/edit?error=version`);
  }

  try {
    await archiveAnnouncement(id, version, identity);
  } catch (error) {
    logMutationFailure("archive", error);
    redirect(`/admin/news/${id}/edit?error=archive`);
  }

  revalidateAnnouncementViews();
  redirect("/admin/news?archived=1");
}
