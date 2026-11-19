# Données de la fiche (`data/*.json`)

Générées/complétées à partir des suppléments Matrice du dépôt `sr4-convert2md` (`supplements/matrix/`, 2026-11-19).
`node tools/generate-spirits.js` lit `spirits`, `traditions`, `sprites`, `streams`, `technocritters`, `ai` ; les autres fichiers sont de référence (non utilisés par la fiche, ni par le générateur).

| Fichier | Contenu | Source |
|---|---|---|
| `sprites.json` | 15 sprites (5 SR4A, 5 Unwired, 5 entropiques) : décalages d'attributs, multiplicateur d'initiative, `matrix` (décalages Réponse/Pare-feu, les 15 sprites), `stats` (formules en R, `verified`), compétences, formes complexes (+ optionnelles, règle 1 par 3 points), pouvoirs et `powerDetails`, flux compilant le sprite, parangons donnant +1, origine (entropiques) | SR4A p.242 ; UW p.154-156, 179-181 |
| `streams.json` | 14 flux dont 5 dissonants : attribut de Fading (`fadeAttributeKey`), sprites, philosophie | UW p.136-139, 175-178 |
| `sprite_powers.json` | pouvoirs de sprites (SR4A, Unwired, libres, entropiques) | SR4A p.242-243 ; UW p.156-160, 179-181 |
| `echoes.json` | échos (base, Unwired, avancés + prérequis, dissonants) | SR4A p.243-244 ; UW p.145-149, 175-178 |
| `paragons.json` | 17 parangons de technomancien et 7 dissonants, avec les sprites bonifiés | UW p.149-151 |
| `widgets.json` | widgets (Widget Crafting) et règle de création | UW p.148-149 |
| `technocritters.json` | 9 espèces : Résonance, passes, compétences, formes, pouvoirs | RW p.189-193, 216-218 |
| `ai.json` | 7 types d'IA et l'e-ghost d'Unwired avec décalages d'attributs (`attrMod`, relatifs à R), bonus d'initiative ; 18 IA férales de Running Wild (sans attributs) | UW p.166-171 ; RW p.195-201 |
| `programming_table.json` | table de programmation avancée (seuils et intervalles, logiciels, options, malwares) | UW p.119 |
| `technomancer_rules.json` | règle optionnelle « Resonance Difference », coûts de submersion (tâche, réseau, -40 %) | UW p.137-142 |

## Limites connues
- Les statistiques des 10 sprites d'Unwired (dont entropiques) ont été retrouvées le 2026-11-19 : l'en-tête imprimé donne l'ordre des colonnes (Pilote, Réponse, Pare-feu, Init. matricielle, PI, Edge, Résonance). Elles sont désormais `verified: true`.
- Numéros de page des sprites Unwired (154) approximatifs : section UW p.154-156.
- Les flux dissonants n'ont pas d'attribut de Fading fixé par le livre (`fadeAttribute: null`, choix du MJ) ; ils compilent par défaut les cinq sprites entropiques.
- Les IA férales (Running Wild) n'ont pas de lignes d'attributs lisibles.
- `programming_table.json` : le regroupement des lignes « options » et « malwares » suit l'ordre de lecture ; seuil de réparation des bugs 16 (texte) ou 12 (une copie du tableau), intervalle 1 heure (texte) ou 1 semaine (tableau).
