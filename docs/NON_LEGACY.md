# Branche `non-legacy` : feuille sans "legacy sanitization"

`sheet.json` : `"legacy": false`. Le drapeau ne rend pas la feuille obsolete : il choisit les regles de nettoyage du code par Roll20.
Le mode CSE (non legacy) n'ajoute pas le prefixe `sheet-` aux classes et exige que le CSS de la feuille soit prefixe par
`.ui-dialog .tab-content .charsheet`. Le source (pug / scss) n'a pas change ; une etape de post-traitement convertit la sortie compilee.

## Build
`npm run build` = generate:spirits, compile:pug, compile:sass puis `node tools/to-cse.js` (ecrase `Shadowrun4thEdition.css` / `.html`).
`npm run build:legacy` reproduit l'ancienne sortie (sans conversion). Ne pas lancer `npm run cse` deux fois de suite sans recompiler :
la conversion n'est pas rejouable sur un fichier deja converti (les prefixes seraient ajoutes en double).
Test du convertisseur : `node tools/to-cse.test.js`.

## Ce que fait `tools/to-cse.js`
- CSS : `.sheet-xxx` -> `.xxx` ; chaque selecteur recoit `.ui-dialog .tab-content .charsheet` devant ; commentaires supprimes ;
  regles `@media` traitees a l'interieur ; selecteurs de roll templates (`sheet-rolltemplate-*`) laisses tels quels.
- Classes reservees par Roll20 (`row`, `col`, `character`, `new-window`, `3colrow`, `2colrow`) renommees `sr-row`, `sr-col`... dans le CSS et dans les
  attributs `class` du HTML (hors `<rolltemplate>`), pour ne pas heriter des styles de Roll20.
- Rien a changer dans le JS : les sheet workers ne dependent pas des classes.

## A verifier dans Roll20 (je n'ai pas pu le tester ici)
1. Onglets PC et NPC (grunt, esprit, vehicule, sprite, hote) : mise en page, onglets, sections repetables, masquages (`flag_special`, `sheet_type`).
2. Roll templates (`rolls`) : mise en forme inchangee.
3. Specificite : un style de Roll20 qui l'emporterait encore sur la feuille (le prefixe est cense l'eviter).
4. Retour arriere : `git checkout main` puis `npm run build`, recoller HTML / CSS et decocher "legacy sanitization".

## Dans l'editeur de feuille de la partie
Coller le HTML et le CSS construits, et **decocher** la case "Legacy Sanitization" (equivalent de `"legacy": false` du bac a sable).
