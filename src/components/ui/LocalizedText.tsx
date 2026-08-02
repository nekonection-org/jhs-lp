import { cn } from "@/lib/cn";

interface LocalizedTextProps {
  ja: string;
  en: string;
  className?: string;
}

export function LocalizedText({ ja, en, className }: LocalizedTextProps) {
  return (
    <>
      <span className={cn(className)} data-locale-content="ja">
        {ja}
      </span>
      <span className={cn(className)} data-locale-content="en">
        {en}
      </span>
    </>
  );
}
