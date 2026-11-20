# Contexte à donner à Claude (instance VS Code) — projet « Outils Shadowrun 4 »

À lire en entier au début d'une session. Mis à jour le 2026-11-20 (fin de la session « magie », complété avec le dépôt chummer4). Le MJ parle français : **répondre en français**. Les suppléments compilés (`sr4-convert2md`) sont en anglais.

## 1. Ce qu'est le projet
Ensemble d'outils pour jouer à Shadowrun 4e édition sur Roll20 :
- **Fiche de personnage Roll20** (`sr4-roll20-sheet`, Pug + SCSS + JS, une seule fiche avec `attr_sheet_type` : `pc`, `grunt`, `spirit`, `sprite`, `ai`, `vehicle`…).
- **Scripts API Roll20** (`sr4-roll20-scripts` : `importer`, `conjuror`, `vehicle-link`, `combat-management`).
- **Livres convertis en Markdown + suppléments thématiques** (`sr4-convert2md` : `books/`, `supplements/magic/00–30`, `supplements/matrix/…`).
- **Chummer 4 modifié** (dépôt `chummer4`, **actif** : export Roll20, voir §2bis) et **scripts Python de calcul** (explosifs, etc., à venir).

Décision du 2026-11-20 : **les rituels/wards/loges et l'alchimie ne seront PAS dans la fiche** ; ce sera un script Python ou une appli téléphone (hors fiche). Ne pas les ajouter à la fiche.

## 2. Dépôts et branches (propriétaire GitHub : Karna-bot)
| Dépôt | Branche de travail | Remarques |
|---|---|---|
| `sr4-roll20-sheet` | **`non-legacy`** (mode CSE, `sheet.json` `legacy:false`) | `main` = ancienne base ; `spirit-type` = ancienne branche, fusionnée |
| `sr4-roll20-scripts` | `main` | `feuille-originale` = scripts de la fiche d'origine, ne pas mélanger |
| `chummer4` | `main` | Chummer 4 (C#, .NET Framework 4.8) modifié pour exporter en JSON « contrat v2 » vers la fiche/l'importeur Roll20 |
| `sr4-convert2md` | `main` | contient aussi le PDF Running Wild (`books/Shadowrun 4E - Running Wild.pdf`) et les `books/extract/*` |

Pages imprimées = page PDF − 2 pour SR4A, SM, Arsenal, RC, RW ; décalage 0 pour DG, WotA, Parageology, Parabotany.

## 2bis. Dépôt `chummer4` (Chummer modifié pour l'export Roll20)
- Base : copie de ordith/ChummerGenSR4 @ `856457e` (2017). Retargeté .NET Framework 4.8. **Se compile sous Windows** (VS Build Tools) : tâche VS Code « build chummer (debug) » = `.vscode/build.ps1` (MSBuild via vswhere, Debug AnyCPU) → `bin/ChummerGenSR4_Debug.exe`.
- **Export Roll20** :
  - `bin/sheets/Roll20 JSON.xsl` (PJ, type `pc`, XSLT 1.0 en sortie texte, marqueur `<!-- ext:json -->`, 357 lignes) et `bin/sheets/Roll20 JSON Vehicles.xsl` (un tableau de véhicules/drones, type `vehicle`). Le PJ exporte aussi `vehicles[]`.
  - `bin/export/Debug XML.xsl` : transformation identité pour inspecter le XML d'impression.
  - Menu **Fichier > Exporter vers Roll20** dans `Chummer/frmCareer.cs` (région « Roll20 export », `InitRoll20ExportMenu`) : personnage ou véhicules, presse-papiers ou fichier, nom suggéré, dossier mémorisé.
  - Le visualiseur d'impression enregistre les feuilles texte (JSON) en `.json` exact.
  - Correctif : plantage à l'ouverture d'anciens persos (capacité de forme complexe vide, `TechProgram.CalculatedCapacity`).
  - `package-players.bat` : fabrique `dist\ChummerRoll20_AAAAMMJJ.zip` pour les joueurs (bin sans ancien exe/.pdb/saves, dossier saves vide + LISEZMOI).
- Contrat de données : `claude/CONTRAT_V2.md` (projet Claude) ; le JSON est lu par `sr4-roll20-scripts/importer/Importer.js`. Toute modification de champ côté XSL doit être répercutée dans l'importeur et la fiche (noms `attr_*`).
- Règles perso envisagées (non faites) : adeptes −25 % (`powers.xml` `<points>` ×0,75 ; `Power.Load` relit `pointsperlevel` du `.chum`), passes d'initiative des esprits 3 astral / 2 matérialisé. Les nouveaux champs magie de la fiche (focus, PP, background count, mentor, statut d'esprit) **ne sont pas encore exportés par Chummer ni lus par l'importeur** : à ajouter ensemble.
- `.gitignore` exclut `*.exe`/`*.zip` mais le dépôt les suit : `git add -f` pour les nouveaux fichiers de ces types.
- Historique amont non repris : `git remote add upstream https://github.com/ordith/ChummerGenSR4`.

## 3. Compiler, tester, publier
- `npm install` puis `npm run build` = `generate:spirits` (esprits, traditions, sprites, IA… depuis `data/*.json` → `src/js/*-types.js`, `src/pug/_*-types.pug`) → `sync:translations` → `compile:pug` → `compile:sass` → `cse` (`tools/to-cse.js`, **non rejouable deux fois sans recompiler**).
- `npm run update` (`tools/update.js`) : remet à zéro tous les fichiers générés (html, css, `src/js/*-types.js`, `src/pug/_*-types.pug`), `git pull --rebase`, rebuild. `npm test` : `to-cse.test.js` + `worker-check.js` (assertions magie ; lancé aussi par la CI). Outillage sans `pug-cli` ni `npm-run-all` (`tools/compile-pug.js`, Pug 3) ; Sass en modules `@use` (voir l'en-tête de `src/scss/_hide.scss`) ; `.gitattributes` force LF (la CI commit « Build: html/css compiles [skip ci] » sur la branche : **toujours `git pull --rebase` avant de pousser**).
- Roll20 : coller `Shadowrun4thEdition.html` + `.css` dans l'éditeur de feuille de la partie ; **décocher** « Legacy Sanitization ».
- Traductions : `translation.json` = clés anglaises de référence, `translations/fr.json` tenu à la main, les autres langues complétées par `tools/sync-translations.js` (ajoute les clés manquantes en anglais). Tout `data-i18n` / `data-i18n-title` nouveau doit être ajouté à `translation.json` + `fr.json`.
- Tests existants : `node tools/to-cse.test.js`, `tools/worker-check.js`.
- Commits : terminer par les deux lignes
  `Co-Authored-By: Claude <noreply@anthropic.com>` (ou le modèle utilisé) et, si la session cloud d'origine est citée, `Claude-Session: https://claude.ai/code/session_0168reyLpo4AXtVNKqt4TJ7W`.
- Hook « commits non poussés » : peut être un faux positif (référence `origin/non-legacy` absente). Vérifier avec `git ls-remote origin refs/heads/non-legacy` contre `git rev-parse HEAD` ; `git fetch origin +refs/heads/non-legacy:refs/remotes/origin/non-legacy` règle le décompte.

## 4. **Important : ce qui n'a jamais été compilé ni testé**
Les sessions précédentes (cloud, sans réseau ni Pug/Sass) ont écrit du Pug/JS **sans pouvoir compiler**. Tout ce qui suit est donc à compiler et vérifier en premier :
1. Matrice avancée (persona vivante, échos, paragon, widgets, pouvoirs de sprites, Resonance Difference, IA) — voir `docs/MATRICE_AVANCEE.md`, `docs/IA_TECHNOCREATURES.md` (checklists).
2. **Magie (2026-11-20, cette session)** — voir §6.
3. Mise en forme SCSS des nouveaux blocs (non ajustée).
Procédure conseillée : `npm install && npm run build`, corriger les erreurs Pug/JS, ouvrir la feuille dans Roll20 (ou un aperçu), parcourir les checklists, corriger, committer. Vérifier particulièrement les `${x}` dans les attributs `title` des champs répétables (convention existante du dépôt : chaîne simple, pas un gabarit JS).

## 5. Données (`data/`) — voir `data/README.md`
Consommées par le générateur : `spirits.json` (44 types), `traditions.json`, `sprites.json`, `ai.json`, `echoes.json`, `paragons.json`, `widgets.json`, `sprite_powers.json`, `technomancer_rules.json`, `programming_table.json`.
Branchées en menus « Catalogue » (2026-11-20, `src/js/magic-catalog-types.js`) : **`adept_powers.json`** (78 pouvoirs, mode passive/situational/toggle/roll, test, bonus[], coûts), **`foci.json`** (multiplicateurs Karma, dupliqués en dur dans `updateFoci`), **`spells.json`** (208 sorts : SR4A, SM, DG, WAR ; `dvMod` = modificateur de Force/2 ; modèles avec `[Object]`, `[Attribute]`, `[Metatype/Species]`), **`metamagics.json`** (28 techniques, prérequis, `adeptAllowed`). `foci.json` reste dupliqué en dur dans `updateFoci`.

## 6. Travail « magie » du 2026-11-20 (non compilé)
- **Onglet Magie PJ** (`src/pug/tabs/_magic.pug`, workers dans `src/js/scripts.js` en fin de fichier, événements dans `src/js/eventhandlers.js`) :
  - section **Focus** (`repeating_foci` : nom, type, Force, lié, actif, coût Karma ; totaux et avertissements : liés > Magie, Force totale > Magie×5, actifs > Logique, Focus Addiction si Force active > 2×Magie) → `updateFoci()`.
  - **Points de pouvoir** dans la section pouvoirs (`pp_cost`, `pp_favored` −25 %, `pp_flat`, `pp_mode`, `pp_test`, totaux `pp_used`/`pp_left`/`pp_warning`, `pp_mystic` pour mystic adept, `initiation_pp` option +1 PP) → `updatePowerPoints()`.
  - **Background count signé** (`background_count`) : Magic −|BC| (utilisé pour PP et limites de focus), Drain +|BC| et Force des esprits −|BC| **affichés seulement** (`bc_summary`) → `updateBackgroundCount()`.
  - Champs structurés **mentor** (`mentor_spirit`, `mentor_advantage`, `mentor_disadvantage`) et `magic_qualities` : texte, sans effet automatique.
- **Fiche esprit** (`src/pug/_npc.pug`) : sélecteur `spirit_status` (summoned/bound/free/wild/ally) à côté de `summoner_name`, `bound`, `services` ; pas encore de logique JS.
- **Esprits** : +23 créatures Running Wild dans `spirits.json` (voir `source`, `verified`, `check`). `Knocker` : Init imprimée incohérente (`verified:false`). `Imp` : colonne Corps illisible, supposée = Force. `Apparition` : pas d'Init/IP.

## 7. À faire (par priorité suggérée)
1. Compiler et corriger tout le §4 ; ajuster le SCSS.
2. **Catalogues (fait le 2026-11-20)** : menus pouvoirs d'adepte / sorts (sorts et préparations) / métamagies, barème Improved Reflexes, coût du grade suivant (10 + 3×grade, −20 %/−40 %), Magie max (6 + grade), avertissements (métamagies + PP > grade, grade > Magie), Drain du jet de sort ≥ 1. **Reste** : bonus automatiques des pouvoirs passifs (Improved Reflexes, Attribute Boost, Mystic Armor…), Drain physique si Force > Magie et avertissement Force > 2×Magie dans le jet, tester dans Roll20.
3. Appliquer vraiment le **background count** (Drain, Force des esprits, perte de pouvoirs d'adepte) et le statut d'esprit.
4. Esprits manquants (Street Magic / `supplements/magic/18–19, 29`) : ombre (muse, nightmare, shade, succubus, wraith), sang, shedim ; la Chasse Sauvage (stats fixes) ; `data/critter_powers.json` depuis `supplements/magic/28` (type M/P, action, portée, durée) pour infobulles. Conserver `verified:false` quand la source est incertaine.
5. **Export Chummer → fiche** : ajouter au XSL et à l'importeur les foci, points de pouvoir, background count, mentor, métamagies (`attr_foci`, `pp_*`, `background_count`…). Importeur : branches `pc`, `sprite`, `vehicle`, connaissances/langues (voir `claude/CONTEXTE.md` du projet Claude).
7. **Fait le 2026-11-20 (fin)** : fiche véhicule PNJ refaite (panneau Contrôle/Tests sur deux colonnes, statistiques en grille, Accel texte « 10/25 », Hand/Speed (Off) retirés, case Notes `vehicle_notes`) ; importeur 3.7.0 (`--prefix` : fiches liées nommées « PJ - Nom », aide de jeu « PJ - fiches » avec liens). Rangement en dossier impossible par l'API (`Campaign._journalfolder` en lecture seule). **Reste** : vérifier la fiche véhicule dans Roll20 ; exporter les esprits liés depuis Chummer (aucun exemple de fichier) pour les créer comme fiches liées ; `importer/tests/conflict_diff_test.js` échoue déjà avant ces changements (TypeError `current`) : à corriger.
6. Hors fiche : script Python / appli téléphone pour rituels, wards, loges, alchimie (sources : `supplements/magic/17, 26, 27, 14`) et explosifs.

## 8. Règles de jeu utiles (rappels vérifiés)
- Drain : Force/2 (arrondi inf.) + mod, jamais < 1, Étourdissant sauf Force > Magie (Physique) ; Force max = 2×Magie.
- Focus : Karma de lien = Force × (symbolique 1, soutien 2, contresort/bannissement/lien/arme 3, sorts/invocation 4, ancrage/centrage/masque/bouclier 6, pouvoir 8) ; liés ≤ Magie ; Force liée totale ≤ Magie×5 ; un seul focus ajoute sa Force à une réserve ; actifs ≤ Logique.
- Points de pouvoir adepte = Magie (mystic : points investis) ; niveau max = Magie ; Improved Reflexes 1,5/2,5/4 ; pouvoirs favoris de Voie −25 % (1 par 2 Magie, WotA p.14).
- Initiation : coût 10 + 3×grade Karma ; groupe ou ordalie −20 %, les deux −40 % ; grade ≤ Magie ; Magie naturelle max 6 + grade ; les adeptes n'ont que Adept Centering, Centering, Flexible Signature, Masking (base) + ajouts SM/WotA/DG (`adeptAllowed`).
- L'option « +1 point de pouvoir au lieu d'une métamagie » n'est mentionnée que comme règle optionnelle (WotA p.14 ; RC pour esprits libres PJ) ; son texte d'origine n'est pas dans les livres disponibles → présentée comme case optionnelle.

## 9. Où est le reste du contexte
- Projet Claude « Outils Shadowrun4 » : `CONTEXTE.md` (ancien, 2026-11-11 : certaines parties sont périmées — la branche de travail est maintenant `non-legacy`, et la compilation est possible en local), `claude/CONTRAT_V2.md`, `claude/AVANCEMENT_*.md` (historique), `claude/RECUL_MUNITIONS.md`.
- Dépôt sheet : `docs/NON_LEGACY.md`, `docs/MATRICE_AVANCEE.md`, `docs/IA_TECHNOCREATURES.md`, `docs/VEHICULES.md`, `data/README.md`.
- Dépôt convert2md : `supplements/magic/00_index_and_conflicts.md` (index + conflits entre livres + points à vérifier), `PROGRESS.md`.
