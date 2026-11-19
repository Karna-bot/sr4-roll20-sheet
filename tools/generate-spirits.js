// Genere src/js/spirit-types.js et src/pug/_spirit-types.pug depuis data/spirits.json
// Lance automatiquement par "npm run build". Ne modifie pas les fichiers generes a la main.
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const spirits = JSON.parse(fs.readFileSync(path.join(root, 'data', 'spirits.json'), 'utf8'))
const ATTRS = ['body', 'agility', 'reaction', 'strength', 'charisma', 'intuition', 'logic', 'willpower']
const key = name => name.toLowerCase()
const label = name => name.replace(/_/g, ' ')

const js = [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/spirits.json : ne pas modifier a la main.',
  '// Attribut = Force + decalage ; ordre des decalages : ' + ATTRS.join(', ') + '.',
  'const SPIRIT_TYPES = {',
  Object.entries(spirits).map(([name, s]) =>
    `  ${key(name)}: {offsets: [${ATTRS.map(a => (s.attrMod || {})[a] || 0).join(', ')}], powers: ${JSON.stringify((s.powers || []).join(', '))}}`
  ).join(',\n'),
  '}',
  ''
].join('\n')
fs.writeFileSync(path.join(root, 'src', 'js', 'spirit-types.js'), js)

const pug = '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const spiritTypes = [' + Object.keys(spirits).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n'
fs.writeFileSync(path.join(root, 'src', 'pug', '_spirit-types.pug'), pug)
console.log(`${Object.keys(spirits).length} types d'esprits generes`)

// ---- TRADITIONS (onglet Magie de la fiche PC) : data/traditions.json -> src/js/tradition-types.js, src/pug/_tradition-types.pug
const traditions = JSON.parse(fs.readFileSync(path.join(root, 'data', 'traditions.json'), 'utf8'))
const CORE = ['body', 'agility', 'reaction', 'strength', 'charisma', 'intuition', 'logic', 'willpower']
const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
// Les traditions "libres" (ex. "Trad GM") sont remplacees par l'option "Custom" de la fiche
const usable = Object.entries(traditions).filter(([name]) => !/^Trad GM/i.test(name))
const parseDrain = text => {
  // Les deux premiers attributs de base cites ("Willpower + Intuition / Logic" -> willpower, intuition)
  const found = (String(text || '').toLowerCase().match(/[a-z]+/g) || []).filter(w => CORE.includes(w))
  return found.length >= 2 ? found.slice(0, 2) : null
}
const spiritsText = t => ['combat', 'detection', 'health', 'illusion', 'manipulation']
  .map(k => `${k[0].toUpperCase()}${k.slice(1)}: ${((t.spirits || {})[k] || '-').replace(/_/g, ' ')}`).join(' | ')

const tjs = [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/traditions.json : ne pas modifier a la main.',
  'const TRADITIONS = {',
  usable.map(([name, t]) => `  ${slug(name)}: {drain: ${JSON.stringify(parseDrain(t.drainAttribute))}, spirits: ${JSON.stringify(spiritsText(t))}}`).join(',\n'),
  '}',
  ''
].join('\n')
fs.writeFileSync(path.join(root, 'src', 'js', 'tradition-types.js'), tjs)
fs.writeFileSync(path.join(root, 'src', 'pug', '_tradition-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const traditionTypes = [' + usable.map(([n]) => `['${slug(n)}', '${n.replace(/'/g, "\\'")}']`).join(', ') + '];\n')
console.log(`${usable.length} traditions generees`)

// ---- SPRITES (fiche type sprite) : data/sprites.json -> src/js/sprite-types.js, src/pug/_sprite-types.pug
// Attribut = Niveau + decalage (charisme, intuition, logique ; les autres attributs d'un sprite valent 0 d'apres Chummer).
const sprites = JSON.parse(fs.readFileSync(path.join(root, 'data', 'sprites.json'), 'utf8'))
const SPRITE_ATTRS = ['charisma', 'intuition', 'logic']
const list = a => JSON.stringify((a || []).join(', '))
fs.writeFileSync(path.join(root, 'src', 'js', 'sprite-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/sprites.json : ne pas modifier a la main.',
  '// Attribut = Niveau + decalage ; ordre des decalages : ' + SPRITE_ATTRS.join(', ') + '. initMult : initiative matricielle = Niveau x initMult.',
  'const SPRITE_TYPES = {',
  Object.entries(sprites).map(([name, s]) =>
    `  ${key(name)}: {offsets: [${SPRITE_ATTRS.map(a => (s.attrMod || {})[a] || 0).join(', ')}], initMult: ${s.initMult || 1}, matrix: ${s.matrix ? `[${s.matrix.response || 0}, ${s.matrix.firewall || 0}]` : 'null'}, powers: ${list(s.powers)}, skills: ${list(s.skills)}, forms: ${list(s.complexForms)}, optionalForms: ${list(s.optionalComplexForms)}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_sprite-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const spriteTypes = [' + Object.keys(sprites).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n')
console.log(`${Object.keys(sprites).length} types de sprites generes`)

// ---- STREAMS (onglet Matrice de la fiche PC, technomanciens) : data/streams.json -> src/js/stream-types.js, src/pug/_stream-types.pug
const streams = JSON.parse(fs.readFileSync(path.join(root, 'data', 'streams.json'), 'utf8'))
const parseFade = text => {
  const found = (String(text || '').toLowerCase().match(/[a-z]+/g) || []).filter(w => CORE.includes(w) || w === 'resonance')
  return found.length >= 2 ? found.slice(0, 2) : null
}
const spriteLabel = n => n.replace(/_/g, ' ')
fs.writeFileSync(path.join(root, 'src', 'js', 'stream-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/streams.json : ne pas modifier a la main.',
  'const STREAMS = {',
  Object.entries(streams).map(([name, st]) =>
    `  ${slug(name)}: {fade: ${JSON.stringify(parseFade(st.fadeAttribute))}, sprites: ${JSON.stringify((st.sprites || []).map(spriteLabel).join(', '))}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_stream-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const streamTypes = [' + Object.keys(streams).map(n => `['${slug(n)}', '${n.replace(/'/g, "\\'")}', ${JSON.stringify((streams[n].sprites || []).map(x => x.toLowerCase()))}]`).join(', ') + '];\n')
console.log(`${Object.keys(streams).length} flux generes`)

// ---- TECHNOCRITTERS (fiche grunt emergee) : data/technocritters.json -> src/js/technocritter-types.js, src/pug/_technocritter-types.pug
// Statistiques matricielles (Reponse, Signal, Systeme, Pare-feu, Filtre de biofeedback) = Resonance (Running Wild p.189-192).
const critters = JSON.parse(fs.readFileSync(path.join(root, 'data', 'technocritters.json'), 'utf8'))
fs.writeFileSync(path.join(root, 'src', 'js', 'technocritter-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/technocritters.json : ne pas modifier a la main.',
  'const TECHNOCRITTER_TYPES = {',
  Object.entries(critters).map(([name, c]) =>
    `  ${key(name)}: {resonance: ${c.resonance}, passes: ${c.passes}, skills: ${list([c.skills])}, forms: ${list([c.complexForms])}, powers: ${list([c.powers])}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_technocritter-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const technocritterTypes = [' + Object.keys(critters).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n')
console.log(`${Object.keys(critters).length} technocritters generes`)

// ---- IA (fiche type "ai") : data/ai.json -> src/js/ai-types.js, src/pug/_ai-types.pug
const ais = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ai.json'), 'utf8'))
const aiKey = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
fs.writeFileSync(path.join(root, 'src', 'js', 'ai-types.js'), [
  '// FICHIER GENERE par tools/generate-spirits.js depuis data/ai.json : ne pas modifier a la main.',
  'const AI_TYPES = {',
  Object.entries(ais).map(([name, a]) =>
    `  ${aiKey(name)}: {group: ${JSON.stringify(a.group)}, notes: ${JSON.stringify(a.notes || '')}, skills: ${JSON.stringify(a.skills || '')}, programs: ${JSON.stringify(a.programs || '')}, qualities: ${JSON.stringify(a.qualities || '')}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_ai-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const aiTypes = [' + Object.entries(ais).map(([n, a]) => `['${aiKey(n)}', '${a.group} - ${n.replace(/'/g, "\\'")}']`).join(', ') + '];\n')
console.log(`${Object.keys(ais).length} types d'IA generes`)
