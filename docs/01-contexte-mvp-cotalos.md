# Contexte produit et technique - MVP cotalos.be

## 1. Vision et objectif MVP
Le MVP `cotalos.be` est un annuaire national de boucheries/traiteurs en Belgique, oriente SEO et capture de demande.  
Le produit ne vend pas encore un SaaS complet. Il sert a valider un pull market avant investissement dans une solution de precommande complete.

Objectif principal:
- Prouver qu un volume significatif de clients souhaite commander en ligne chez son boucher local.

Resultats attendus:
- Signaux de demande client mesurables (leads, conversion).
- Signaux de traction commercants (prises de contact inbound).
- Premiers canaux d acquisition organique stables.

## 2. Hypotheses a valider
H1 - Demande client:
- Les clients sont prets a laisser leur email pour etre prevenus quand la precommande sera disponible.

H2 - Traction SEO locale:
- Les pages ville et commerce captent des recherches de longue traine avec un trafic organique croissant.

H3 - Levier commercial:
- Les commercants reagissent positivement a un indicateur de demande ("X personnes veulent commander chez vous").

H4 - Faisabilite acquisition:
- Le cout d acquisition organique est compatible avec un futur modele SaaS B2B.

## 3. Perimetre
Inclus:
- Annuaire Belgique complete des boucheries/traiteurs/charcuteries.
- Homepage + pages ville + pages commerce + pages legales.
- Capture d interet client (lead utilisateur).
- Capture d interet commercant (lead pro).
- Admin minimal (import, suppression, stats, export).

Exclus (non-objectifs):
- Paiement en ligne.
- Prise et gestion de commandes.
- Livraison.
- Dashboard commercant complet.
- Application mobile.
- Catalogue produits structure.

## 4. Cible et geographie
Couverture geographique MVP:
- Belgique complete.

Strategie langue MVP:
- Interface et contenu en FR uniquement au lancement.
- Le modele d URL et les donnees doivent rester compatibles avec une future extension NL.

Personas prioritaires:
- Client final cherchant "boucherie + ville" ou "traiteur + retrait + ville".
- Responsable de commerce voulant digitaliser la prise de commande.

## 5. Proposition de valeur
Valeur cote client:
- Trouver rapidement un boucher proche.
- Verifier si la commande en ligne est active.
- Signaler son interet et etre notifie a l activation.

Valeur cote commercant:
- Visualiser une demande reelle et locale.
- Recevoir un canal d acquisition qualifie.
- Comprendre le potentiel avant adhession a une offre SaaS.

## 6. Architecture fonctionnelle du site
Homepage (`/`):
- Proposition de valeur claire.
- Barre de recherche ville/commerce.
- Liens vers villes populaires.
- CTA commercants.

Pages ville (`/boucheries/{ville}`):
- Liste des commerces de la ville.
- Filtres simples par categorie.
- Texte SEO local.
- Carte optionnelle (non bloquante MVP).

Pages commerce (`/boucherie/{slug}`):
- Informations publiques du commerce.
- Bloc principal "service pas encore disponible".
- Formulaire client "Etre prevenu".
- Bloc commercant "Activer la commande en ligne".
- Mentions legales et lien de gestion/suppression fiche.

Pages legales:
- Mentions legales.
- Politique de confidentialite.
- Procedure "gerer ou supprimer cette fiche".

## 7. Contrats d interface publics
### 7.1 Routes publiques
- `GET /`
- `GET /boucheries/{ville}`
- `GET /boucherie/{slug}`
- `GET /mentions-legales`
- `GET /politique-confidentialite`
- `GET /gerer-ou-supprimer-cette-fiche`

Contraintes route:
- URL lisibles, en slug lowercase, tirets.
- Canonical URL par page.

### 7.2 Contrat formulaire lead client
Usage:
- Capture d interet "Etre prevenu" sur page commerce.

Champs:
- `prenom`: string nullable, max 80.
- `email`: string obligatoire, format email valide, max 254.
- `consentement`: boolean obligatoire, doit etre `true`.
- `commerce_id`: UUID obligatoire.
- `source`: string obligatoire (ex: `commerce_page`).
- `ville`: string obligatoire.

Regles:
- Rejet si consentement absent.
- Rejet si email invalide.
- Rate limiting par IP/session.
- Protection anti-bot via captcha.

### 7.3 Contrat formulaire lead commercant
Usage:
- Capture de contact pro "Activer la commande en ligne".

Champs:
- `nom`: string obligatoire, max 120.
- `email`: string obligatoire, format valide.
- `telephone`: string obligatoire, format libre normalise.
- `commerce_id`: UUID obligatoire.
- `commerce_nom`: string prerempli.
- `ville`: string obligatoire.
- `message`: string nullable, max 1000.

Regles:
- Validation email/longueur.
- Honeypot + rate limiting + captcha.

## 8. Modele de donnees v1 (PostgreSQL)
### 8.1 Table `commerces`
Colonnes minimales:
- `id` UUID PK.
- `nom` TEXT NOT NULL.
- `adresse` TEXT NOT NULL.
- `ville` TEXT NOT NULL.
- `code_postal` TEXT NOT NULL.
- `latitude` NUMERIC(9,6) NULL.
- `longitude` NUMERIC(9,6) NULL.
- `telephone` TEXT NULL.
- `slug` TEXT NOT NULL UNIQUE.
- `categorie` TEXT NOT NULL CHECK (`categorie` in ('boucherie','traiteur','charcuterie')).
- `source_principale` TEXT NOT NULL.
- `date_import` TIMESTAMPTZ NOT NULL DEFAULT now().
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now().
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT now().

Index minimaux:
- Index sur (`ville`).
- Index sur (`code_postal`).
- Index sur (`categorie`).

### 8.2 Table `leads_clients`
Colonnes minimales:
- `id` UUID PK.
- `commerce_id` UUID NOT NULL FK -> `commerces(id)` ON DELETE CASCADE.
- `email` TEXT NOT NULL.
- `prenom` TEXT NULL.
- `consentement` BOOLEAN NOT NULL.
- `ville` TEXT NOT NULL.
- `source` TEXT NOT NULL.
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now().

Contraintes:
- CHECK format email applicatif + normalisation lowercase.
- Index (`commerce_id`), (`created_at`), (`ville`).

### 8.3 Table `leads_commercants`
Colonnes minimales:
- `id` UUID PK.
- `commerce_id` UUID NOT NULL FK -> `commerces(id)` ON DELETE CASCADE.
- `nom` TEXT NOT NULL.
- `email` TEXT NOT NULL.
- `telephone` TEXT NOT NULL.
- `message` TEXT NULL.
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT now().

Index minimaux:
- Index (`commerce_id`), (`created_at`).

## 9. Acquisition et SEO
Principes:
- Pages statiques/ISR priorisees pour performance et indexation.
- Meta title et meta description uniques par page.
- H1 unique et contenu textuel minimal utile.
- Liens internes homepage -> villes -> commerces.
- Sitemap XML genere automatiquement.
- Robots.txt permissif sur pages publiques.

Cibles requetes:
- `boucherie {ville}`
- `traiteur {ville}`
- `plateau barbecue {ville}`

## 10. Conformite legale
Obligations:
- Mention explicite "donnees publiques".
- Mention explicite "aucune affiliation commerciale".
- RGPD: base legale de consentement pour emails.
- Lien vers politique de confidentialite.
- Mecanisme opt-out commercant.
- Procedure de correction/suppression de fiche.

Interdits:
- Simuler un service actif de commande pour le commercant.
- Encaisser un paiement.
- Utiliser logos, photos, branding proprietaires non libres.
- Fausse representation d affiliation ou partenariat.

## 11. Securite et anti-spam
Mesures minimales:
- Captcha sur formulaires (client et commercant).
- Rate limiting par IP + fingerprint session.
- Validation stricte server-side des payloads.
- Journalisation des rejets anti-spam.
- Sanitization des entrees texte.
- Protection CSRF pour soumissions de formulaires.

## 12. KPI et seuils de validation MVP
KPI principaux:
- Nombre de leads clients collectes.
- Taux de conversion page commerce -> inscription.
- Nombre de leads commercants inbound.
- Repartition geographique de la demande.
- Croissance trafic organique.

Seuils de succes MVP:
- Conversion leads clients >= 5% (cible haute >= 10%).
- Concentration de demande visible sur un sous-ensemble de commerces.
- Premiers contacts commercants spontanes.
- Tendance de croissance SEO sur plusieurs semaines.

## 13. Risques et mitigations
Risque: contenu trop maigre pour SEO.
- Mitigation: texte local minimal qualitatif, maillage interne, metadata rigoureuses.

Risque: plaintes commercants (visibilite non desiree).
- Mitigation: page legale claire, opt-out simple, SLA interne de suppression.

Risque: spam formulaires.
- Mitigation: captcha + honeypot + rate limiting + monitoring.

Risque: confusion utilisateur sur service actif.
- Mitigation: message principal explicite "pas encore disponible".

Risque: qualite de donnees importees heterogene.
- Mitigation: pipeline de normalisation + verification echantillonnee.

## 14. Decisions figees (ADR leger)
Decision 1 - Stack imposee:
- Front/API: Next.js.
- Base de donnees: PostgreSQL.
- Raison: rapidite MVP, SEO natif, ecosysteme mature, extensibilite SaaS.

Decision 2 - Couverture geographique:
- Belgique complete des le MVP.
- Raison: maximiser signaux de demande et apprentissage marche.

Decision 3 - Strategie langue:
- FR uniquement au lancement.
- Raison: reduction de complexite operationnelle et production contenu.

Decision 4 - Carte:
- Optionnelle sur pages ville/commerce.
- Raison: non critique pour validation du pull market.

## 15. Scenarios de validation documentaire
Scenario A - Couverture fonctionnelle:
- Chaque point du brief source est trace vers au moins une story.

Scenario B - Coherence perimetre:
- Aucune story n introduit paiement, prise de commande, livraison.

Scenario C - Coherence geo/langue:
- Stories compatibles Belgique complete + interface FR-only.

Scenario D - Coherence technique:
- Stories et contexte alignes avec Next.js + PostgreSQL.

Scenario E - Coherence legale:
- Mentions publiques, RGPD, opt-out, non-affiliation presentes.

Scenario F - Lisibilite execution:
- Un binome produit/tech peut implementer sans decision structurante supplementaire.

## 16. Hypotheses et defaults explicites
- Format des livrables: Markdown FR.
- Stories niveau feature sans decomposition en taches techniques.
- Carte non bloquante MVP.
- Champs telephones publics optionnels sur fiches commerces.
- Import initial base sur donnees publiques uniquement.
