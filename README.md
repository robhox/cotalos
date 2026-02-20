# cotalos.be - Epic 1 MVP

Base Next.js (App Router) + Tailwind pour l Epic 1:
- US-001: homepage + recherche mock ville/commerce
- US-002: pages legales FR
- US-003: disclaimers non-affiliation sur page commerce

## Lancer localement

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run test
npm run test:e2e
```

## Configuration legale

Mettre a jour les placeholders dans:
- `lib/site-config.ts`

## Routes publiques

- `/`
- `/mentions-legales`
- `/politique-confidentialite`
- `/gerer-ou-supprimer-cette-fiche`
- `/boucherie/[slug]`
- `/boucheries/[ville]`
