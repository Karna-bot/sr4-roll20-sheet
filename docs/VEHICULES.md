# Type de fiche « Vehicle » (véhicules et drones)

Un véhicule ou un drone est un **nœud matriciel** : il a ses statistiques de deck (Réponse, Système, Signal, Pare-feu) et son Pilote. Les jets dépendent du **mode de contrôle** (menu « Control mode »), de l'interface (AR, VR cold-sim, VR hot-sim) et des statistiques de l'**opérateur** (rigger ou pilote), saisies sur la fiche du véhicule.

## Champs (visibles en mode réglages)
- Véhicule (existant) : handling, speed, acceleration, body, pilot, sensor, seats, blindage unique (`ballistic`, `impact` est recopié automatiquement : un véhicule n'a qu'un type d'armure).
- Nœud : `veh_response`, `veh_system`, `veh_signal`, `veh_firewall`. La **Matrix Initiative** d'un véhicule = Pilote + Réponse.
- Contrôle : `veh_command` (programme Commande), Réaction / Agilité / Intuition de l'opérateur, Initiative de l'opérateur et ses IP (manuel / AR), compétences (pilotage, tir, esquive, mêlée, perception, infiltration), autosofts (Maneuver, Targeting, Defense, Clearsight, Covert Ops).
- Bonus réglables : Control Rig (défaut +2) et Hot-sim (défaut +2), utilisés en mode immergé.

## Réserves de dés
| Test | Manuel | Commande à distance | Rigger immergé | Autonome |
|---|---|---|---|---|
| Manœuvre | Réaction + Pilotage | Commande + Pilotage | Réponse + Pilotage | Pilote + Maneuver |
| Tir | Agilité + Tir | Commande + Tir | Capteur + Tir | Pilote + Targeting |
| Défense (distance) | Réaction | Commande | Réponse | Pilote |
| Défense (mêlée) | Réaction + Mêlée | Commande + Mêlée | Réponse + Mêlée | Pilote + Defense |
| Défense totale | Réaction + Esquive | Commande + Esquive | Réponse + Esquive | Pilote + Defense |
| Perception | Intuition + Perception | Capteur + Perception | Capteur + min(Perception, Intuition) | Capteur + Clearsight |
| Infiltration | Agilité + Infiltration | Commande + Infiltration | Réponse + Infiltration | Pilote + Covert Ops |
| Résistance | Corps + blindage, dans tous les modes (un seul jet) |

## Initiative
| Mode | Score | Passes (IP) |
|---|---|---|
| Manuel | Réaction + Intuition de l'opérateur | IP de l'opérateur (1 à 4) |
| Commande à distance | Initiative de l'opérateur | AR : IP de l'opérateur ; VR cold 2 ; VR hot 3 |
| Rigger immergé | Réponse + Intuition | 2 (cold) ; 3 (hot) |
| Autonome | Pilote + Réponse | 3 |
Les IP écrivent `initiative_passes_base` ; la fiche calcule le total.

## Bonus
- Rigger immergé : + Control Rig sur chaque réserve (hors résistance), + Hot-sim en VR hot-sim ; seuil −1 (affiché, non appliqué aux dés).
- Autonome : seuil −1 (affiché).
- Manuel avec abonnement AR (case à cocher) : +1 dé.

## Hypothèses à confirmer
1. Manuel : défense (distance) = Réaction seule ; perception = Intuition + Perception ; infiltration = Agilité + Infiltration (non précisés dans le tableau).
2. Commande à distance : pas de bonus Hot-sim (le tableau ne le prévoit que pour l'immersion).
3. Control Rig et Hot-sim se cumulent en hot-sim immergé.
4. Le bouton d'initiative reprend la convention de la fiche (dés d'initiative + score) et l'en-tête `initiative` lu par CombatManagement.
5. Les coûts de maintenance restent hors de la fiche.

## Lier un personnage (script API `vehicle-link`)
Commande `!link-vehicle` (voir `sr4-roll20-scripts/vehicle-link/README.md`) : recopie les statistiques d'un personnage (Réaction, Agilité, Intuition, Initiative, IP, compétences Pilotage/Artillerie/Esquive/Mêlée/Perception/Infiltration, bonus de Control Rig) dans les champs « opérateur » du véhicule. Le personnage lié apparaît dans « Linked character » ; le menu « Piloting skill used » (réglages) choisit la compétence de pilotage (par défaut la meilleure compétence Pilot). La mise à jour n'est faite que sur commande.
