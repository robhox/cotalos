# Backlog stories - MVP cotalos.be

## Convention
Format de chaque story:
- `ID`
- `Titre`
- `Feature`
- `Valeur metier`
- `Dependances` (si necessaire)

Portee:
- Belgique complete.
- Interface FR uniquement au MVP.
- Niveau feature (pas de sous-taches techniques).

---

## Epic 1 - Fondations produit et conformite

### US-001
ID: `US-001`  
Titre: Cadrer le message MVP sur la homepage  
Feature: Afficher clairement que cotalos.be est un annuaire de precommande non active avec recherche ville/commerce et CTA principal.  
Valeur metier: Reduire la confusion utilisateur et augmenter la conversion vers les pages commerce.  
Dependances: Aucune.

### US-002
ID: `US-002`  
Titre: Publier les pages legales obligatoires  
Feature: Mettre en ligne mentions legales, politique de confidentialite et page de gestion/suppression de fiche.  
Valeur metier: Couvrir les obligations legale/RGPD et diminuer le risque de plainte.  
Dependances: US-001.

### US-003
ID: `US-003`  
Titre: Afficher les disclaimers de non-affiliation  
Feature: Ajouter sur chaque page commerce un message "donnees publiques" et "aucune affiliation commerciale".  
Valeur metier: Eviter la fausse representation et securiser le cadre legal.  
Dependances: US-002.

---

## Epic 2 - Donnees commerces et ingestion

### US-004
ID: `US-004`  
Titre: Definir le schema `commerces`  
Feature: Creer le modele de donnees des commerces avec slug unique, categorie, geolocalisation et date import.  
Valeur metier: Disposer d une base fiable pour generer pages ville et commerce.  
Dependances: Aucune.

### US-005
ID: `US-005`  
Titre: Import initial des commerces belges  
Feature: Importer des donnees publiques normalisees (nom, adresse, ville, code postal, categorie, coordonnees).  
Valeur metier: Lancer rapidement une couverture nationale utile pour SEO et test de demande.  
Dependances: US-004.

### US-006
ID: `US-006`  
Titre: Pipeline de qualite de donnees  
Feature: Detecter doublons, valider slugs, verifier champs critiques et marquer les fiches incompletes.  
Valeur metier: Limiter erreurs visibles et proteger la credibilite du site.  
Dependances: US-005.

### US-007
ID: `US-007`  
Titre: Mettre a jour les imports de facon recurrente  
Feature: Permettre un re-import incremental avec conservation des IDs et historique de date import.  
Valeur metier: Garder l annuaire pertinent dans le temps sans casser les URLs SEO.  
Dependances: US-006.

---

## Epic 3 - SEO et navigation

### US-008
ID: `US-008`  
Titre: Generer les pages ville SEO  
Feature: Creer `/boucheries/{ville}` avec liste des commerces, texte local minimal et filtres simples.  
Valeur metier: Capter le trafic local longue traine.  
Dependances: US-005.

### US-009
ID: `US-009`  
Titre: Generer les pages commerce SEO  
Feature: Creer `/boucherie/{slug}` avec metadata uniques et structure indexable.  
Valeur metier: Positionner chaque commerce sur des intentions locales precises.  
Dependances: US-005.

### US-010
ID: `US-010`  
Titre: Rechercher une ville ou un commerce  
Feature: Ajouter une recherche depuis la homepage avec redirection vers page ville ou commerce pertinente.  
Valeur metier: Raccourcir le parcours utilisateur vers l intention de conversion.  
Dependances: US-008, US-009.

### US-011
ID: `US-011`  
Titre: Publier sitemap et regles d indexation  
Feature: Generer un sitemap XML complet et regler robots/canonical pour eviter duplication.  
Valeur metier: Accelerer indexation et stabiliser performances SEO.  
Dependances: US-008, US-009.

---

## Epic 4 - Page commerce (core MVP)

### US-012
ID: `US-012`  
Titre: Afficher les informations publiques commerce  
Feature: Presenter nom, adresse, ville, telephone public (si dispo), lien carte et categorie.  
Valeur metier: Repondre au besoin de decouverte locale avant conversion.  
Dependances: US-009.

### US-013
ID: `US-013`  
Titre: Afficher le bloc indisponibilite service  
Feature: Montrer un message principal explicite "la commande en ligne n est pas encore disponible".  
Valeur metier: Eviter malentendus et cadrer la proposition de notification.  
Dependances: US-012.

### US-014
ID: `US-014`  
Titre: Afficher l indicateur de demande locale  
Feature: Afficher "X personnes souhaitent commander ici" calcule depuis les leads clients valides.  
Valeur metier: Renforcer preuve sociale et pression commerciale positive.  
Dependances: US-018.

### US-015
ID: `US-015`  
Titre: Proposer des commerces similaires a proximite  
Feature: Afficher une selection de commerces proches ou meme categorie en fin de page commerce.  
Valeur metier: Augmenter pages vues et retention SEO interne.  
Dependances: US-012.

---

## Epic 5 - Capture de leads client/commercant

### US-016
ID: `US-016`  
Titre: Formulaire client "Etre prevenu"  
Feature: Capturer `email` obligatoire, `prenom` optionnel et consentement RGPD obligatoire.  
Valeur metier: Mesurer la demande client reelle au niveau commerce.  
Dependances: US-013.

### US-017
ID: `US-017`  
Titre: Persister les leads clients  
Feature: Enregistrer lead client avec `commerce_id`, `ville`, `source`, timestamp et contraintes minimales.  
Valeur metier: Produire une base analytique exploitable pour validation de marche.  
Dependances: US-016.

### US-018
ID: `US-018`  
Titre: Definir le schema `leads_clients`  
Feature: Mettre en place table PostgreSQL et index pour lecture par commerce, ville et periode.  
Valeur metier: Garantir performance de suivi KPI et affichage indicateur de demande.  
Dependances: US-004.

### US-019
ID: `US-019`  
Titre: Formulaire commercant "Activer la commande en ligne"  
Feature: Capturer `nom`, `email`, `telephone`, `commerce`, `ville`, `message` optionnel depuis la page commerce.  
Valeur metier: Generer des opportunites B2B qualifiees.  
Dependances: US-013.

### US-020
ID: `US-020`  
Titre: Persister les leads commercants  
Feature: Enregistrer les demandes commercants avec timestamp et rattachement au commerce cible.  
Valeur metier: Alimenter le pipeline commercial initial.  
Dependances: US-019.

### US-021
ID: `US-021`  
Titre: Definir le schema `leads_commercants`  
Feature: Mettre en place table PostgreSQL et index pour priorisation commerciale par zone et recence.  
Valeur metier: Permettre traitement rapide des leads entrants.  
Dependances: US-004.

### US-022
ID: `US-022`  
Titre: Protections anti-spam formulaires  
Feature: Ajouter captcha, rate limiting, validation server-side et honeypot sur les 2 formulaires.  
Valeur metier: Preserver qualite des donnees et limiter bruit operationnel.  
Dependances: US-016, US-019.

---

## Epic 6 - Admin minimal et export

### US-023
ID: `US-023`  
Titre: Interface admin import/suppression fiches  
Feature: Permettre a l equipe interne d importer des commerces et de desactiver/supprimer une fiche.  
Valeur metier: Maitriser la qualite du catalogue sans intervention technique lourde.  
Dependances: US-005.

### US-024
ID: `US-024`  
Titre: Interface admin statistiques MVP  
Feature: Afficher leads clients, taux conversion, leads commercants, repartition geo et tendance trafic.  
Valeur metier: Piloter objectivement la decision go/no-go du produit SaaS.  
Dependances: US-017, US-020.

### US-025
ID: `US-025`  
Titre: Export des leads  
Feature: Exporter leads clients et commercants (CSV) avec filtres date/ville/commerce.  
Valeur metier: Faciliter analyse et suivi commercial hors outil.  
Dependances: US-024.

---

## Epic 7 - Mesure et validation KPI

### US-026
ID: `US-026`  
Titre: Instrumenter le funnel de conversion  
Feature: Tracer vues page commerce, soumissions formulaire client et taux conversion par commerce/ville.  
Valeur metier: Mesurer la traction reelle et identifier les poches de demande.  
Dependances: US-017.

### US-027
ID: `US-027`  
Titre: Rapports de validation MVP  
Feature: Produire un reporting periodique compare aux seuils de succes (>=5% conversion, signaux B2B, croissance SEO).  
Valeur metier: Permettre une decision factuelle sur la suite produit.  
Dependances: US-024, US-026.

---

## Verification de couverture du brief
- Architecture globale couverte: US-001, US-008, US-009, US-012.
- Core page commerce couverte: US-013, US-016, US-017, US-019, US-020.
- Legal/RGPD/opt-out couverts: US-002, US-003.
- SEO critique couvert: US-008, US-009, US-011.
- Admin minimal couvert: US-023, US-024, US-025.
- KPI et criteres de succes couverts: US-024, US-026, US-027.
- Non-objectifs respectes: aucune story sur paiement, commandes, livraison ou app mobile.
