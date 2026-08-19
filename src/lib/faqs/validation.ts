import {
  editableFaqStatuses,
  faqContentStatuses,
  type FaqInput,
} from "@/lib/faqs/types";

export const faqFieldNames = [
  "status",
  "contentStatus",
  "sortOrder",
  "questionJa",
  "answerJa",
  "questionEn",
  "answerEn",
] as const;

export type FaqFieldName = (typeof faqFieldNames)[number];
export type FaqFieldErrors = Partial<Readonly<Record<FaqFieldName, string>>>;

export type FaqValidationResult =
  | { success: true; data: FaqInput }
  | { success: false; errors: FaqFieldErrors };

function getText(formData: FormData, name: FaqFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateRequiredText(
  value: string,
  field: FaqFieldName,
  label: string,
  maximumLength: number,
  errors: Record<string, string>,
) {
  if (!value) {
    errors[field] = `${label}を入力してください。`;
  } else if (value.length > maximumLength) {
    errors[field] = `${label}は${maximumLength}文字以内で入力してください。`;
  }
}

export function validateFaqForm(formData: FormData): FaqValidationResult {
  const errors: Record<string, string> = {};
  const status = getText(formData, "status");
  const contentStatus = getText(formData, "contentStatus");
  const sortOrderValue = getText(formData, "sortOrder");
  const questionJa = getText(formData, "questionJa");
  const answerJa = getText(formData, "answerJa");
  const questionEn = getText(formData, "questionEn");
  const answerEn = getText(formData, "answerEn");

  if (!editableFaqStatuses.some((value) => value === status)) {
    errors.status = "公開状態を選択してください。";
  }

  if (!faqContentStatuses.some((value) => value === contentStatus)) {
    errors.contentStatus = "内容の確認状態を選択してください。";
  }

  const sortOrder = Number(sortOrderValue);
  if (
    !/^\d+$/.test(sortOrderValue) ||
    !Number.isSafeInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 9999
  ) {
    errors.sortOrder = "表示順は0から9999までの整数で入力してください。";
  }

  validateRequiredText(questionJa, "questionJa", "日本語の質問", 240, errors);
  validateRequiredText(answerJa, "answerJa", "日本語の回答", 4000, errors);

  if (status === "published") {
    validateRequiredText(questionEn, "questionEn", "英語の質問", 240, errors);
    validateRequiredText(answerEn, "answerEn", "英語の回答", 4000, errors);
  } else if (questionEn || answerEn) {
    validateRequiredText(questionEn, "questionEn", "英語の質問", 240, errors);
    validateRequiredText(answerEn, "answerEn", "英語の回答", 4000, errors);
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      status: status as FaqInput["status"],
      contentStatus: contentStatus as FaqInput["contentStatus"],
      sortOrder,
      translations: {
        ja: { question: questionJa, answer: answerJa },
        en:
          questionEn && answerEn
            ? { question: questionEn, answer: answerEn }
            : null,
      },
    },
  };
}
