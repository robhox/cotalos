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
          background:
            "radial-gradient(circle at 14% -8%, #fff5ee 0%, rgba(255,245,238,0) 34%), radial-gradient(circle at 92% 8%, #efe2d8 0%, rgba(239,226,216,0) 32%), linear-gradient(145deg, #f7f3f1 0%, #f2e9e2 55%, #e9d8c8 100%)",
          color: "#1a1a1a",
          display: "flex",
          height: "100%",
          padding: "40px",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(107,27,40,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(107,27,40,0.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            inset: 0,
            opacity: 0.48,
            position: "absolute"
          }}
        />

        <div
          style={{
            background: "rgba(194,168,120,0.2)",
            borderRadius: "999px",
            height: "240px",
            left: "-70px",
            position: "absolute",
            top: "-88px",
            width: "240px"
          }}
        />
        <div
          style={{
            background: "rgba(107,27,40,0.14)",
            borderRadius: "999px",
            bottom: "-120px",
            height: "320px",
            position: "absolute",
            right: "-100px",
            width: "320px"
          }}
        />

        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(107,27,40,0.17)",
            borderRadius: "24px",
            boxShadow: "0 18px 40px rgba(107,27,40,0.14)",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "38px 42px",
            position: "relative",
            width: "100%"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(107,27,40,0.22)",
                borderRadius: "999px",
                color: "#6b1b28",
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.2em",
                padding: "10px 16px",
                textTransform: "uppercase"
              }}
            >
              🥩 Annuaire des boucheries belges
            </div>
            <div
              style={{
                color: "rgba(26,26,26,0.62)",
                display: "flex",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}
            >
              Belgique
            </div>
          </div>

          <div
            style={{
              color: "#6b1b28",
              display: "flex",
              flexDirection: "column",
              fontFamily: "\"Times New Roman\", Georgia, serif",
              fontSize: 66,
              fontWeight: 700,
              gap: "14px",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              maxWidth: "910px"
            }}
          >
            <div style={{ display: "flex" }}>
              Trouvez un boucher proche
            </div>
            <div style={{ display: "flex" }}>
              de chez vous en quelques secondes
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: "1px solid rgba(107,27,40,0.16)",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "16px"
            }}
          >
            <div
              style={{
                alignItems: "center",
                color: "#6b1b28",
                display: "flex",
                fontFamily: "\"Times New Roman\", Georgia, serif",
                fontSize: 40,
                gap: "9px"
              }}
            >
              <div style={{ display: "flex", fontSize: 32, lineHeight: 1 }}>🥩</div>
              cotalos.be
            </div>
            <div
              style={{
                alignItems: "center",
                color: "rgba(26,26,26,0.74)",
                display: "flex",
                fontSize: 22,
                gap: "14px"
              }}
            >
              <div style={{ display: "flex" }}>Ville, code postal, commerce</div>
              <div
                style={{
                  background: "#c2a878",
                  borderRadius: "999px",
                  display: "flex",
                  height: "8px",
                  width: "8px"
                }}
              />
              <div style={{ display: "flex" }}>Local</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      emoji: "twemoji"
    }
  );
}
