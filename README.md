# cotalos.be - Epic 1 MVP

Base Next.js (App Router) + Tailwind pour l Epic 1:
- US-001: homepage + recherche ville/commerce en base locale
- US-002: pages legales FR
- US-003: disclaimers non-affiliation sur page commerce

## Lancer localement

```bash
npm install
npm run dev
```

## Base PostgreSQL locale (Docker)

1. Copier les variables d'environnement:

```bash
cp .env.example .env
```

2. Demarrer PostgreSQL:

```bash
npm run db:up
```

Si le port `5432` est deja utilise, lancer sur un autre port:

```bash
POSTGRES_PORT=55432 npm run db:up
```

3. Appliquer les migrations Prisma:

```bash
npm run prisma:migrate
```

4. Generer le client Prisma:

```bash
npm run prisma:generate
```

## Import BCE/KBO (boucheries)

Import complet (full refresh):

```bash
npm run import:boucheries -- --data-dir ./data
```

Options:
- `--nace-version` (defaut: `2025`)
- `--nace-codes` (codes exacts, separes par virgules)

Codes exacts utilises par defaut:
- Boucheries: `47.22`, `47.221`, `47.222`

Exemple:

```bash
npm run import:boucheries -- --data-dir ./data --nace-version 2025 --nace-codes "47.22,47.221,47.222"
```

Verifications SQL rapides:

```sql
SELECT COUNT(*) FROM "Commerce";
SELECT COUNT(*) FROM "ImportRun" WHERE status = 'SUCCESS';
SELECT "establishmentNumber", "slug" FROM "Commerce" LIMIT 20;
```

## Brancher l UI sur la DB locale

1. Configurer `DATABASE_URL` dans `.env` (adapter le port si besoin):

```env
DATABASE_URL=postgresql://cotalos:cotalos@localhost:5432/cotalos?schema=public
```

2. Demarrer l app:

```bash
npm run dev
```

3. Recherche live disponible via:
- endpoint `GET /api/search?q=...&limit=...`
- homepage `/` (suggestions dynamiques)
- pages `/boucheries/[ville]` et `/boucherie/[slug]` alimentees depuis PostgreSQL

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
