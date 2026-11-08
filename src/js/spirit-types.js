// FICHIER GENERE par tools/generate-spirits.js depuis data/spirits.json : ne pas modifier a la main.
// Attribut = Force + decalage ; ordre des decalages : body, agility, reaction, strength, charisma, intuition, logic, willpower.
const SPIRIT_TYPES = {
  air: {offsets: [-2, 3, 4, -3, 0, 0, 0, 0], powers: "Accident, Astral Form, Concealment, Confusion, Elemental Attack, Engulf, Materialization, Movement, Sapience"},
  beasts: {offsets: [2, 1, 2, 2, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Enhanced Senses, Fear, Materialization, Movement, Natural Weapon, Sapience"},
  earth: {offsets: [4, -2, 0, 4, 0, 0, 0, 0], powers: "Astral Form, Binding, Engulf, Guard, Materialization, Movement, Sapience"},
  fire: {offsets: [1, 2, 3, -2, 0, 0, 0, 0], powers: "Accident, Astral Form, Confusion, Elemental Attack, Energy Aura, Engulf, Materialization, Sapience"},
  man: {offsets: [1, 0, 2, -2, 0, 0, 0, 0], powers: "Accident, Astral Form, Concealment, Confusion, Enhanced Senses, Guard, Influence, Materialization, Sapience, Search"},
  water: {offsets: [2, 0, 2, 0, 0, 0, 0, 0], powers: "Accident, Astral Form, Concealment, Confusion, Elemental Attack, Engulf, Materialization, Sapience"},
  guardian: {offsets: [1, 2, 3, 2, 0, 0, 0, 0], powers: "Astral Form, Fear, Guard, Magical Guard, Materialization, Movement, Sapience"},
  guidance: {offsets: [3, -1, 2, 1, 0, 0, 0, 0], powers: "Astral Form, Confusion, Divining, Guard, Magical Guard, Materialization, Sapience, Search, Shadow Cloak"},
  plant: {offsets: [3, -1, 2, 4, 0, 0, 0, 0], powers: "Astral Form, Concealment, Engulf, Fear, Guard, Magical Guard, Materialization, Sapience, Silence"},
  task: {offsets: [2, 1, 1, 2, 0, 0, 0, 0], powers: "Accident, Astral Form, Binding, Materialization, Movement, Movement (Self), Sapience"},
  insect_soldier: {offsets: [2, 0, 1, 3, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Fear, Hive Mind, Inhabitation, Sapience"},
  insect_scout: {offsets: [0, 2, 2, 0, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Concealment, Enhanced Senses, Hive Mind, Inhabitation, Movement, Sapience, Search"},
  insect_caretaker: {offsets: [2, 1, 0, 1, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Guard, Hive Mind, Inhabitation, Sapience"},
  insect_nymph: {offsets: [-1, 0, 3, -1, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Enhanced Senses, Hive Mind, Inhabitation, Innate Spell, Sapience"},
  insect_worker: {offsets: [3, 0, 1, 2, 0, 0, 0, 0], powers: "Animal Control, Astral Form, Enhanced Senses, Hive Mind, Inhabitation, Movement, Sapience, Search"},
  toxic_fire_nuclear: {offsets: [1, 2, 3, -2, 0, 0, 0, 0], powers: "Accident, Astral Form, Elemental Attack (Radiation), Energy Aura, Engulf, Materialization, Sapience"},
  toxic_air_smog: {offsets: [-2, 3, 4, -3, 0, 0, 0, 0], powers: "Accident, Astral Form, Elemental Attack, Engulf, Materialization, Movement, Noxious Breath, Sapience"},
  toxic_earth_sludge: {offsets: [3, -1, 2, 3, 0, 0, 0, 0], powers: "Astral Form, Binding, Engulf, Materialization, Movement, Sapience, Search"},
  toxic_water_pollution: {offsets: [2, 0, 2, 0, 0, 0, 0, 0], powers: "Accident, Astral Form, Confusion, Elemental Attack, Engulf, Materialization, Sapience"},
  toxic_man_harrow: {offsets: [0, 2, 3, -2, 0, 0, 0, 0], powers: "Accident, Astral Form, Concealment, Confusion, Enhanced Senses, Fear, Influence, Materialization, Sapience, Search"},
  cicak: {offsets: [1, 3, 2, 0, 0, 0, 0, 0], powers: "Astral Form, Banishing Resistance, Fey Glamour, Materialization, Movement, Natural Weapon, Sapience, Vanishing, Wall Walking"}
}
