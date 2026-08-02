import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#101411",
        border: "2px solid #8fbd78",
        color: "#f3f5f3",
        display: "flex",
        fontSize: 24,
        fontWeight: 800,
        height: "100%",
        justifyContent: "center",
        letterSpacing: "-0.06em",
        width: "100%",
      }}
    >
      JH
    </div>,
    size,
  );
}
