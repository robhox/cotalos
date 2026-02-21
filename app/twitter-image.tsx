import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(140deg, #f7f3f1 0%, #f2e9e2 48%, #e8d2bc 100%)",
          color: "#3c1f1c",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "48px",
          width: "100%"
        }}
      >
        <div
          style={{
            color: "#6b1b28",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 14,
            textTransform: "uppercase"
          }}
        >
          cotalos.be
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
            textAlign: "center"
          }}
        >
          Trouvez un boucher proche de chez vous
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
