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
