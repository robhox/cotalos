import { LegalPageLayout } from "@/components/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Politique de cookies - cotalos.be",
  description:
    "Informations sur les cookies utilises par cotalos.be, leur finalite et vos choix.",
  path: "/cookies"
});

export default function CookiesPage() {
  const legal = siteConfig.legalIdentity;

  return (
    <LegalPageLayout
      title="Politique de cookies"
      lead="Cette page explique l usage des cookies et traceurs sur cotalos.be."
    >
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Quels cookies utilisons-nous ?</h2>
        <p>Cookies techniques necessaires au bon fonctionnement du site.</p>
        <p>
          Cookies de mesure d audience utilises pour comprendre l usage global
          du service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Finalites</h2>
        <p>Assurer la navigation et la stabilite des pages.</p>
        <p>Mesurer les parcours anonymises pour ameliorer l experience.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Vos choix</h2>
        <p>
          Vous pouvez configurer votre navigateur pour bloquer ou supprimer les
          cookies deja stockes.
        </p>
        <p>
          Pour toute question, contactez-nous a l adresse: {legal.contactEmail}
        </p>
      </section>
    </LegalPageLayout>
  );
}
