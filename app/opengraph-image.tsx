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
          background:
            "radial-gradient(circle at 16% -8%, #fff5ee 0%, rgba(255,245,238,0) 34%), radial-gradient(circle at 92% 8%, #efe2d8 0%, rgba(239,226,216,0) 32%), linear-gradient(145deg, #f7f3f1 0%, #f2e9e2 55%, #e9d8c8 100%)",
          color: "#1a1a1a",
          display: "flex",
          height: "100%",
          padding: "42px",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(107,27,40,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(107,27,40,0.08) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            inset: 0,
            opacity: 0.5,
            position: "absolute"
          }}
        />

        <div
          style={{
            background: "rgba(194,168,120,0.23)",
            borderRadius: "999px",
            height: "280px",
            left: "-80px",
            position: "absolute",
            top: "-90px",
            width: "280px"
          }}
        />
        <div
          style={{
            background: "rgba(107,27,40,0.16)",
            borderRadius: "999px",
            bottom: "-130px",
            height: "360px",
            position: "absolute",
            right: "-110px",
            width: "360px"
          }}
        />

        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(107,27,40,0.17)",
            borderRadius: "26px",
            boxShadow: "0 20px 44px rgba(107,27,40,0.14)",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "44px 50px",
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
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(107,27,40,0.24)",
                borderRadius: "999px",
                color: "#6b1b28",
                display: "flex",
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.22em",
                padding: "11px 18px",
                textTransform: "uppercase"
              }}
            >
              🥩 Annuaire des boucheries belges
            </div>
            <div
              style={{
                color: "rgba(26,26,26,0.65)",
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.13em",
                textTransform: "uppercase"
              }}
            >
              Villes, codes postaux, commerces
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "930px"
            }}
          >
            <div
              style={{
                color: "#6b1b28",
                display: "flex",
                fontFamily: "\"Times New Roman\", Georgia, serif",
                fontSize: 76,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.02
              }}
            >
              Passez commande en ligne chez votre boucher
            </div>
            <div
              style={{
                color: "rgba(26,26,26,0.78)",
                display: "flex",
                fontSize: 31,
                lineHeight: 1.26
              }}
            >
              Trouvez une boucherie par ville, code postal ou nom de commerce.
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              borderTop: "1px solid rgba(107,27,40,0.16)",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "18px"
            }}
          >
            <div
              style={{
                alignItems: "center",
                color: "#6b1b28",
                display: "flex",
                fontFamily: "\"Times New Roman\", Georgia, serif",
                fontSize: 44,
                gap: "10px",
                lineHeight: 1
              }}
            >
              <div style={{ display: "flex", fontSize: 34, lineHeight: 1 }}>🥩</div>
              cotalos.be
            </div>
            <div
              style={{
                alignItems: "center",
                color: "rgba(26,26,26,0.76)",
                display: "flex",
                fontSize: 22,
                gap: "16px"
              }}
            >
              <div style={{ display: "flex" }}>Boucheries locales</div>
              <div
                style={{
                  background: "#c2a878",
                  borderRadius: "999px",
                  display: "flex",
                  height: "9px",
                  width: "9px"
                }}
              />
              <div style={{ display: "flex" }}>Belgique</div>
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
