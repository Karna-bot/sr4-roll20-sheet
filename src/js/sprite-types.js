// FICHIER GENERE par tools/generate-spirits.js depuis data/sprites.json : ne pas modifier a la main.
// Attribut = Niveau + decalage ; ordre des decalages : charisma, intuition, logic. initMult : initiative matricielle = Niveau x initMult.
const SPRITE_TYPES = {
  code: {offsets: [0, 0, 2], initMult: 2, powers: "Info Sortilege, Probability Distribution", skills: "Computer, Data Search, Electronic Warfare", forms: "Browse, Decrypt, Edit, Encrypt", optionalForms: "Analyze, Corrupt, Data Bomb, Scan"},
  courier: {offsets: [0, 1, 1], initMult: 3, powers: "Cookie, Hash", skills: "Computer, Data Search, Hacking", forms: "Analyze, Edit, Encrypt, Stealth, Track", optionalForms: "Browse, Command, Decrypt, Exploit, Scan"},
  crack: {offsets: [0, 1, 0], initMult: 3, powers: "Suppression", skills: "Computer, Electronic Warfare, Hacking", forms: "Analyze, Exploit, Stealth", optionalForms: "Decrypt, Defuse, Edit, Scan, Spoof"},
  data: {offsets: [0, 0, -2], initMult: 2, powers: "Steganography, Watermark", skills: "Computer, Data Search, Electronic Warfare", forms: "Analyze, Browse, Edit, Decrypt", optionalForms: "Defuse, Encrypt, Sniffer, Stealth, Linguasoft"},
  fault: {offsets: [0, 2, 1], initMult: 3, powers: "Electron Storm", skills: "Computer, Cybercombat, Hacking", forms: "Analyze, Armor, Attack, Stealth", optionalForms: "Black Hammer, Blackout, Exploit, Medic"},
  machine: {offsets: [0, 0, 2], initMult: 2, powers: "Diagnostics, Gremlins, Stability", skills: "Computer, Electronic Warfare, Hardware", forms: "Analyze, Command", optionalForms: "Decrypt, Edit, Medic, "},
  paladin: {offsets: [0, 2, 2], initMult: 1, powers: "Castling, Hardening", skills: "Computer, Cybercombat, Hacking", forms: "Armor, Disarm, Medic, Shield", optionalForms: "Analyze, Attack, Blackout, Expert Defense"},
  sleuth: {offsets: [0, -1, 2], initMult: 3, powers: "Cookie, Traceroute", skills: "Computer, Data Search, Electronic Warfare, Hacking", forms: "Analyze, Browse, Sniffer, Spoof, Stealth, Track", optionalForms: "Command, Decrypt, Exploit, Scan"},
  tank: {offsets: [0, 1, 1], initMult: 2, powers: "Assault", skills: "Cybercombat", forms: "Attack, Attack, Blackout, Nuke", optionalForms: "Armor, Black Hammer, Cascading, Medic, Shield"},
  tutor: {offsets: [0, 1, 0], initMult: 2, powers: "Proficiency, Stability", skills: "Computer, Hardware, Instruction, Software", forms: "Analyze, Browse", optionalForms: "Command, Edit, Activesoft, Knowsoft, Linguasoft"}
}
