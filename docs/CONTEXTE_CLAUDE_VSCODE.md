# Contexte à donner à Claude (instance VS Code) — projet « Outils Shadowrun 4 »

À lire en entier au début d'une session. Mis à jour le 2026-11-20 (fin de la session « magie »). Le MJ parle français : **répondre en français**. Les suppléments compilés (`sr4-convert2md`) sont en anglais.

## 1. Ce qu'est le projet
Ensemble d'outils pour jouer à Shadowrun 4e édition sur Roll20 :
- **Fiche de personnage Roll20** (`sr4-roll20-sheet`, Pug + SCSS + JS, une seule fiche avec `attr_sheet_type` : `pc`, `grunt`, `spirit`, `sprite`, `ai`, `vehicle`…).
- **Scripts API Roll20** (`sr4-roll20-scripts` : `importer`, `conjuror`, `vehicle-link`, `combat-management`).
- **Livres convertis en Markdown + suppléments thématiques** (`sr4-convert2md` : `books/`, `supplements/magic/00–30`, `supplements/matrix/…`).
- Modifications **Chummer 4** (dépôt `chummer4`, en pause) et **scripts Python de calcul** (explosifs, etc., à venir).

Décision du 2026-11-20 : **les rituels/wards/loges et l'alchimie ne seront PAS dans la fiche** ; ce sera un script Python ou une appli téléphone (hors fiche). Ne pas les ajouter à la fiche.

## 2. Dépôts et branches (propriétaire GitHub : Karna-bot)
| Dépôt | Branche de travail | Remarques |
|---|---|---|
| `sr4-roll20-sheet` | **`non-legacy`** (mode CSE, `sheet.json` `legacy:false`) | `main` = ancienne base ; `spirit-type` = ancienne branche, fusionnée |
| `sr4-roll20-scripts` | `main` | `feuille-originale` = scripts de la fiche d'origine, ne pas mélanger |
| `sr4-convert2md` | `main` | contient aussi le PDF Running Wild (`books/Shadowrun 4E - Running Wild.pdf`) et les `books/extract/*` |

Pages imprimées = page PDF − 2 pour SR4A, SM, Arsenal, RC, RW ; décalage 0 pour DG, WotA, Parageology, Parabotany.

## 3. Compiler, tester, publier
- `npm install` puis `npm run build` = `generate:spirits` (esprits, traditions, sprites, IA… depuis `data/*.json` → `src/js/*-types.js`, `src/pug/_*-types.pug`) → `sync:translations` → `compile:pug` → `compile:sass` → `cse` (`tools/to-cse.js`, **non rejouable deux fois sans recompiler**).
- `npm run update` : jette les html/css compilés locaux, `git pull`, rebuild (la CI commit « Build: html/css compiles [skip ci] » sur la branche : **toujours `git pull --rebase` avant de pousser**).
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
Référence seulement (pas encore branchées sur la fiche) : **`adept_powers.json`** (78 pouvoirs, mode passive/situational/toggle/roll, test, bonus[], coûts), **`foci.json`** (multiplicateurs Karma, dupliqués en dur dans `updateFoci`), **`spells.json`** (208 sorts : SR4A, SM, DG, WAR ; `dvMod` = modificateur de Force/2 ; modèles avec `[Object]`, `[Attribute]`, `[Metatype/Species]`), **`metamagics.json`** (28 techniques, prérequis, `adeptAllowed`).

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
2. **Brancher les catalogues** : liste déroulante de pouvoirs d'adepte remplissant `pp_cost`, `pp_mode`, `pp_test`, bonus automatiques des pouvoirs passifs (Improved Reflexes, Attribute, Mystic Armor…) ; menu de métamagies et calcul de Magie max / coût d'initiation (10 + 3×grade, −20 %/−40 %) ; **catalogue de sorts** dans la section sorts (DV = Force/2 + `dvMod`, Drain physique si Force > Magie, Force ≤ 2×Magie, bouton de jet Drain).
3. Appliquer vraiment le **background count** (Drain, Force des esprits, perte de pouvoirs d'adepte) et le statut d'esprit.
4. Esprits manquants (Street Magic / `supplements/magic/18–19, 29`) : ombre (muse, nightmare, shade, succubus, wraith), sang, shedim ; la Chasse Sauvage (stats fixes) ; `data/critter_powers.json` depuis `supplements/magic/28` (type M/P, action, portée, durée) pour infobulles. Conserver `verified:false` quand la source est incertaine.
5. Importeur : branches `pc`, `sprite`, `vehicle`, connaissances/langues (voir `claude/CONTEXTE.md` du projet Claude).
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
