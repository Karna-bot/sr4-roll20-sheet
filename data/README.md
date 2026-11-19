# Données de la fiche (`data/*.json`)

Générées/complétées à partir des suppléments Matrice du dépôt `sr4-convert2md` (`supplements/matrix/`, 2026-11-19).
`node tools/generate-spirits.js` lit `spirits`, `traditions`, `sprites`, `streams`, `technocritters`, `ai` ; les autres fichiers sont de référence (non utilisés par la fiche, ni par le générateur).

| Fichier | Contenu | Source |
|---|---|---|
| `sprites.json` | 15 sprites (5 SR4A, 5 Unwired, 5 entropiques) : décalages d'attributs, multiplicateur d'initiative, `matrix` (Réponse/Pare-feu, sprites SR4A seulement), `stats` (formules en R, `verified`), compétences, formes complexes (+ optionnelles, règle 1 par 3 points), pouvoirs et `powerDetails`, flux compilant le sprite, parangons donnant +1, origine (entropiques) | SR4A p.242 ; UW p.154-156, 179-181 |
| `streams.json` | 14 flux dont 5 dissonants : attribut de Fading (`fadeAttributeKey`), sprites, philosophie | UW p.136-139, 175-178 |
| `sprite_powers.json` | pouvoirs de sprites (SR4A, Unwired, libres, entropiques) | SR4A p.242-243 ; UW p.156-160, 179-181 |
| `echoes.json` | échos (base, Unwired, avancés + prérequis, dissonants) | SR4A p.243-244 ; UW p.145-149, 175-178 |
| `paragons.json` | 17 parangons de technomancien et 7 dissonants, avec les sprites bonifiés | UW p.149-151 |
| `widgets.json` | widgets (Widget Crafting) et règle de création | UW p.148-149 |
| `technocritters.json` | 9 espèces : Résonance, passes, compétences, formes, pouvoirs | RW p.189-193, 216-218 |
| `ai.json` | 7 types d'IA d'Unwired et 18 IA férales de Running Wild | UW p.167-169 ; RW p.195-201 |

## Limites connues
- Les statistiques (Réponse, Pare-feu, initiative) des 5 sprites d'Unwired et des 5 sprites entropiques sont illisibles dans la conversion : `stats.verified = false` et `rawSequence` (ordre incertain). À reprendre dans le PDF.
- Numéros de page des sprites Unwired (154) approximatifs : section UW p.154-156.
- Les flux dissonants n'ont pas d'attribut de Fading fixé par le livre (`fadeAttribute: null`, choix du MJ).
- Les 5 flux dissonants et le flux générique « Dissonant » compilent les cinq sprites entropiques (le livre laisse la liste au MJ).
- Les tables de l'IA (lignes d'attributs) ne sont pas stockées (illisibles).
