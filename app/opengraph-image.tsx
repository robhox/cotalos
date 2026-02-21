import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(130deg, #f7f3f1 0%, #f0e7df 45%, #ead6c2 100%)",
          color: "#3c1f1c",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%"
        }}
      >
        <div
          style={{
            color: "#6b1b28",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 16,
            textTransform: "uppercase"
          }}
        >
          cotalos.be
        </div>
        <div
          style={{
            fontSize: 70,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: 1000,
            textAlign: "center"
          }}
        >
          Annuaire boucheries en Belgique
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 28,
            opacity: 0.88
          }}
        >
          Trouvez votre commerce local en quelques secondes
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
