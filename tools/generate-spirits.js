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
  const parts = String(text || '').split('+').map(p => p.trim().toLowerCase())
  return parts.length === 2 && parts.every(p => CORE.includes(p)) ? parts : null
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
    `  ${key(name)}: {offsets: [${SPRITE_ATTRS.map(a => (s.attrMod || {})[a] || 0).join(', ')}], initMult: ${s.initMult || 1}, powers: ${list(s.powers)}, skills: ${list(s.skills)}, forms: ${list(s.complexForms)}, optionalForms: ${list(s.optionalComplexForms)}}`
  ).join(',\n'),
  '}',
  ''
].join('\n'))
fs.writeFileSync(path.join(root, 'src', 'pug', '_sprite-types.pug'),
  '//- FICHIER GENERE par tools/generate-spirits.js : ne pas modifier a la main.\n' +
  '- const spriteTypes = [' + Object.keys(sprites).map(n => `['${key(n)}', '${label(n)}']`).join(', ') + '];\n')
console.log(`${Object.keys(sprites).length} types de sprites generes`)
