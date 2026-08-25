import { brandColors } from "@/lib/brand";

export const socialPreviewAlt =
  "Japan Hideaway Server official Rust Server preview";

export const socialPreviewSize = {
  width: 1200,
  height: 630,
} as const;

const previewItems = [
  "Designated raid hours",
  "Up to 4 players",
  "Community server",
] as const;

export function SocialPreview() {
  return (
    <div
      data-testid="social-preview"
      style={{
        alignItems: "stretch",
        backgroundColor: brandColors.background,
        color: brandColors.text,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "68px 76px 62px 88px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: brandColors.accent,
          display: "flex",
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: 16,
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 24,
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: brandColors.surface,
            border: `2px solid ${brandColors.border}`,
            borderRadius: 12,
            color: brandColors.accent,
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            height: 72,
            justifyContent: "center",
            letterSpacing: 2,
            width: 72,
          }}
        >
          JHS
        </div>
        <div
          style={{
            color: brandColors.muted,
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Japan Hideaway Server
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 750,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          Rust Server
        </div>
        <div
          style={{
            color: brandColors.accent,
            display: "flex",
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          Play on your schedule.
        </div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {previewItems.map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: brandColors.surface,
              border: `1px solid ${brandColors.border}`,
              borderRadius: 8,
              color: brandColors.muted,
              display: "flex",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 0.5,
              padding: "12px 18px",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
