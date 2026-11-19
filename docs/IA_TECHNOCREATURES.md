# IA, sprites et technocréatures (branche non-legacy, 2026-11-19)

Sources (compilées dans `sr4-convert2md/supplements/matrix/`) : fichier 04 (sprites SR4A p.242), 16 (IA, Unwired p.165-170), 22 (IA-PJ, Runner's Companion), 24 (technocritters et IA férales, Running Wild p.189-218).
**Rien de ceci n'a été compilé ni testé dans Roll20** : `npm run build` puis vérifier la liste en bas.

## 1. Statistiques matricielles SR4
Les noms SR5 (Attack, Sleaze, Data Processing) ne sont plus utilisés par les types sprite, IA et grunt émergé.
Champs : `mx_response`, `mx_signal`, `mx_system`, `firewall`, `mx_biofeedback`, `mx_passes` (PI matricielles, 3 par défaut).
La fiche véhicule garde ses champs `veh_*`. Le bloc hôte (`hostObject`) n'est pas modifié (type non proposé dans le menu).

## 2. Sprites
Réponse et Pare-feu = Niveau + décalage pour les 5 sprites du livre de base (SR4A p.242) : Courier +1/+1, Crack +1/0, Data 0/-2, Fault +2/+1, Machine 0/+2.
Les 10 sprites d'Unwired ont des suites de statistiques illisibles dans la conversion (fichier 15) : leurs décalages restent vides (saisie libre).
Initiative matricielle = Niveau x multiplicateur ; passes = `mx_passes` (3). Avant : 4 dés fixes (valeur SR5).

## 3. Technocréatures (grunt, option « Émergé »)
Sélecteur `technocritter_type` (9 espèces de Running Wild). Choisir une espèce : Résonance, Réponse, Signal, Système, Pare-feu et Filtre de biofeedback = Résonance, PI matricielles (4 pour le flipper), compétences et formes complexes (texte), pouvoirs émergents (texte), moniteur matriciel = 8 + Système/2.
Changer la Résonance à la main resynchronise les cinq statistiques tant qu'une espèce est choisie. Initiative matricielle = Réponse x 2.
Les attributs physiques de l'animal restent à saisir (non présents dans Running Wild p.189-218).

## 4. Type de fiche « IA »
Attributs mentaux libres : Charisme, Intuition, Logique, Volonté, Edge. Calculés : Indice = moyenne des 4 (arrondi sup.), Système = moy.(INT, LOG), Pare-feu = moy.(CHA, VOL), moniteur matriciel = 8 + Système/2 (fichiers 16 et 22 : UW p.165-170, RC).
Réponse et Signal : ceux du nœud occupé (saisie). Initiative matricielle = Intuition + Réponse, 3 passes.
Sélecteur `ai_type` : 7 types d'Unwired (métasapient, artifaun, poltergeist, prédateur, archiviste, assembleur, sculpteur) et 18 IA férales de Running Wild. Il remplit « Compétences et formes » (`matrix_info`) et « Qualités ».
Nœud d'origine (`ai_home_node`, texte), bouton Réalignement (Indice x 2). Compétences, formes complexes, qualités et programmes utilisent les sections existantes du grunt.

## 5. Textes ajoutés
`matrix_info` (compétences et formes, grunt émergé et IA), `emergent_powers` (grunt émergé), Qualités (grunt et IA), Programmes (véhicule et IA).

## 6. Divergences et limites
- Les valeurs calculées d'une IA (Indice, Système, Pare-feu) sont réécrites à chaque changement d'attribut mental : une saisie manuelle est perdue à ce moment-là.
- Bonus du nœud d'origine : conflit entre RC (par attribut, ÷2) et UW (Indice ÷2 sur les quatre statistiques) ; **non automatisé**, à saisir à la main dans Réponse/Signal/Système/Pare-feu.
- Fadeur des technocréatures (Intuition + Résonance) non automatisée.
- Lignes d'attributs des types d'IA (CHA/INT/LOG/VOL/EDG) illisibles dans la conversion : non pré-remplies.
- `matrix_initiative` est maintenant écrit pour les fiches non-PC (le bouton d'initiative matricielle PNJ lisait ce champ, jamais renseigné jusque-là).
- Handler `updateMatrixMaximum` (eventhandlers.js) : fonction jamais définie dans le code d'origine ; non touché.

## À vérifier dans Roll20 après `npm run build`
1. Menu « Sheet Type » : option IA. Fiche IA : deux blocs d'attributs, sélecteur de type, nœud d'origine, bouton Réalignement, deuxième colonne masquée.
2. Grunt + « Émergé » : bloc Technocréature dans la colonne centrale, sélecteur d'espèce remplit les champs, textes visibles ; grunt « Mundane » : bloc masqué.
3. Sprite : champs Réponse / Signal / Système / Pare-feu, PI matricielles ; choisir Courier : Réponse = Niveau+1.
4. Bouton d'initiative matricielle (grunt émergé, sprite, IA) : valeur cohérente avec l'affichage.
