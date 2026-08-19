"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { FaqActionState } from "@/app/admin/faqs/action-state";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminAccessError } from "@/lib/auth/cloudflare-access";
import {
  FaqConflictError,
  FaqNotFoundError,
  archiveFaq,
  createFaq,
  updateFaq,
} from "@/lib/faqs/service";
import { validateFaqForm } from "@/lib/faqs/validation";

function failedState(
  message: string,
  fieldErrors: FaqActionState["fieldErrors"] = {},
): FaqActionState {
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

function revalidateFaqViews() {
  updateTag("faqs");
  revalidatePath("/");
  revalidatePath("/admin/faqs");
}

function logMutationFailure(operation: "save" | "archive", error: unknown) {
  console.error("FAQ mutation failed.", {
    operation,
    errorName: error instanceof Error ? error.name : "UnknownError",
  });
}

function handleMutationError(error: unknown) {
  if (error instanceof AdminAccessError) {
    throw error;
  }

  if (error instanceof FaqConflictError) {
    return failedState(
      "ほかの管理者が先に更新しました。一覧から開き直してください。",
    );
  }

  if (error instanceof FaqNotFoundError) {
    return failedState("対象のFAQが見つかりません。");
  }

  logMutationFailure("save", error);
  return failedState(
    "保存できませんでした。時間を置いてからもう一度お試しください。",
  );
}

export async function createFaqAction(
  _previousState: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  let faqId: string;

  try {
    const identity = await requireAdmin();
    const validation = validateFaqForm(formData);
    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }

    const faq = await createFaq(validation.data, identity);
    faqId = faq.id;
  } catch (error) {
    return handleMutationError(error);
  }

  revalidateFaqViews();
  redirect(`/admin/faqs/${faqId}/edit?saved=created`);
}

export async function updateFaqAction(
  id: string,
  _previousState: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  try {
    const identity = await requireAdmin();
    const validation = validateFaqForm(formData);
    const version = parseVersion(formData);

    if (!validation.success) {
      return failedState("入力内容を確認してください。", validation.errors);
    }
    if (version === null) {
      return failedState("更新情報が不正です。一覧から開き直してください。");
    }

    await updateFaq(id, version, validation.data, identity);
  } catch (error) {
    return handleMutationError(error);
  }

  revalidateFaqViews();
  redirect(`/admin/faqs/${id}/edit?saved=updated`);
}

export async function archiveFaqAction(id: string, formData: FormData) {
  const identity = await requireAdmin();
  const version = parseVersion(formData);
  if (version === null) {
    redirect(`/admin/faqs/${id}/edit?error=version`);
  }

  try {
    await archiveFaq(id, version, identity);
  } catch (error) {
    logMutationFailure("archive", error);
    redirect(`/admin/faqs/${id}/edit?error=archive`);
  }

  revalidateFaqViews();
  redirect("/admin/faqs?archived=1");
}
