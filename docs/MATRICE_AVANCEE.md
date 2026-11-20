# Matrice avancée : persona vivante, échos, paragon, widgets, pouvoirs de sprites, Resonance Difference

Branche `non-legacy`. Données : `data/echoes.json`, `paragons.json`, `widgets.json`, `sprite_powers.json`, `technomancer_rules.json`.
`npm run build` (étape `generate:spirits`) génère `src/js/matrix-advanced-types.js` et `src/pug/_matrix-advanced-types.pug`. Ne pas les modifier à la main.

## Fiche PC, onglet Matrice, bloc « Persona vivante »
| Élément | Comportement |
|---|---|
| Persona vivante | Calculée (SR4A p.239) : Pare-feu = Volonté, Réponse = Intuition + 1 (RV), Signal = Résonance/2 (sup.), Système = Logique, Filtre de biofeedback = Charisme, Init. matricielle = Réponse + Intuition, 3 passes. Les bonus des échos s'ajoutent. Un avertissement apparaît si un attribut dépasse Résonance + Submersion (plafond à vérifier selon la table). |
| Échos (lignes répétables) | Menu `echo_type` : remplit nom, effet, source, maximum de prises. `echo_times` = nombre de prises (plafonné au maximum). Bonus automatiques : Firewall Upgrade, NeuroFilter, System Upgrade (+1 chacun), Amplification (+1 Signal), Overclocking (+1 Réponse, +1 passe), Advanced Overclocking (+2 / +2, passes jusqu'à 5). Les autres échos restent descriptifs (texte). |
| Paragon | Menu `paragon` : remplit avantage, désavantage, bonus aux sprites, source. « Custom » = saisie libre. Pas de bonus de dés automatique (ils dépendent d'une compétence ou d'un contexte). |
| Widgets (lignes répétables) | Menu `widget_type`, `widget_rating`. Seuil de création = Indice × 2 (1 h, étendu), Fading = 2 × Indice. Boutons : création (Résonance + Logiciel) et résistance au Fading (attributs de la section Fading). Durée 8 h, non entretenu, plantable (UW p.148-149). |
| Resonance Difference | Case à cocher : affiche les huit effets (UW p.137-139) et un bonus de défense de +2 contre les programmes d'Attaque. Option de table, désactivée par défaut. |

## Fiche sprite
Lignes répétables « pouvoirs » (`repeating_spritepowers`) : le menu du type de sprite les remplit avec nom, effet et source. Chaque ligne a un bouton de jet Niveau × 2 (les tests opposés sont décrits dans le texte du pouvoir). Modifiable : choisir un autre pouvoir dans le menu de la ligne ou « Custom ». Le champ texte « Pouvoirs » existant est conservé.

## Importer (v3.6.0)
PJ : `paragon` (nom), `echoes` (liste de noms ou `{name, times}`), `widgets` (liste de `{name, rating}`), `resonance_difference` (booléen). Un nom absent des menus donne une ligne « Custom » signalée dans le rapport. Test : `sr4-roll20-scripts/importer/tests/pc_technomancer.json`.
Les pouvoirs de sprite sont remplis par la fiche à la sélection du type : pas d'import dédié.

## Vérification
- `node tools/worker-check.js` (workers : persona vivante, échos, paragon, widgets, Resonance Difference, pouvoirs de sprites) : OK.
- Non compilé ni testé dans Roll20 (pas de Pug ni de Sass ici). Après `npm run build`, vérifier : ajout d'un écho (effet et totaux), changement de type de sprite (pouvoirs recréés), case Resonance Difference, boutons de jet.

## Limites
- La mise en forme (SCSS) des nouveaux blocs reprend les classes existantes ; un ajustement visuel peut être nécessaire.
- Plafond de la persona vivante (Résonance, grade de submersion) non appliqué : avertissement seulement.
- Échos « Mesh Reality », « Resonance Exchange », etc. : texte uniquement.

## Compilation et pull
- `npm run update` : jette les html/css modifiés par une compilation précédente, fait `git pull`, puis recompile. À utiliser à la place de `git pull`.
- GitHub Actions (`.github/workflows/build.yml`) recompile et commit html/css à chaque push de sources sur `non-legacy` : le dépôt contient alors toujours la fiche compilée. Dans ce cas, `git checkout -- Shadowrun4thEdition.html Shadowrun4thEdition.css && git pull` suffit, sans compiler en local.
